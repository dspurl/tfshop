<?php

namespace Shalvah\Upgrader\PrettyPrinter;

use PhpParser\Internal\DiffElem;
use PhpParser\Node;

/**
 * Monkey-patch until https://github.com/nikic/PHP-Parser/pull/805 is merged
 */
class Standard extends \PhpParser\PrettyPrinter\Standard
{
    protected function pArray(
        array $nodes, array $origNodes, int &$pos, int $indentAdjustment,
        string $parentNodeType, string $subNodeName, $fixup
    ) {
        $diff = $this->nodeListDiffer->diffWithReplacements($origNodes, $nodes);

        $mapKey = $parentNodeType . '->' . $subNodeName;
        $insertStr = $this->listInsertionMap[$mapKey] ?? null;
        $isStmtList = $subNodeName === 'stmts';

        $beforeFirstKeepOrReplace = true;
        $skipRemovedNode = false;
        $delayedAdd = [];
        $lastElemIndentLevel = $this->indentLevel;

        $insertNewline = false;
        if ($insertStr === "\n") {
            $insertStr = '';
            $insertNewline = true;
        }

        if ($isStmtList && \count($origNodes) === 1 && \count($nodes) !== 1) {
            $startPos = $origNodes[0]->getStartTokenPos();
            $endPos = $origNodes[0]->getEndTokenPos();
            \assert($startPos >= 0 && $endPos >= 0);
            if (!$this->origTokens->haveBraces($startPos, $endPos)) {
                // This was a single statement without braces, but either additional statements
                // have been added, or the single statement has been removed. This requires the
                // addition of braces. For now fall back.
                // TODO: Try to preserve formatting
                return null;
            }
        }

        $result = '';
        foreach ($diff as $i => $diffElem) {
            $diffType = $diffElem->type;
            /** @var Node|null $arrItem */
            $arrItem = $diffElem->new;
            /** @var Node|null $origArrItem */
            $origArrItem = $diffElem->old;

            if ($diffType === DiffElem::TYPE_KEEP || $diffType === DiffElem::TYPE_REPLACE) {
                $beforeFirstKeepOrReplace = false;

                if ($origArrItem === null || $arrItem === null) {
                    // We can only handle the case where both are null
                    if ($origArrItem === $arrItem) {
                        continue;
                    }
                    return null;
                }

                if (!$arrItem instanceof Node || !$origArrItem instanceof Node) {
                    // We can only deal with nodes. This can occur for Names, which use string arrays.
                    return null;
                }

                $itemStartPos = $origArrItem->getStartTokenPos();
                $itemEndPos = $origArrItem->getEndTokenPos();
                \assert($itemStartPos >= 0 && $itemEndPos >= 0 && $itemStartPos >= $pos);

                $origIndentLevel = $this->indentLevel;
                $lastElemIndentLevel = $this->origTokens->getIndentationBefore($itemStartPos) + $indentAdjustment;
                $this->setIndentLevel($lastElemIndentLevel);

                $comments = $arrItem->getComments();
                $origComments = $origArrItem->getComments();
                $commentStartPos = $origComments ? $origComments[0]->getStartTokenPos() : $itemStartPos;
                \assert($commentStartPos >= 0);

                if ($commentStartPos < $pos) {
                    // Comments may be assigned to multiple nodes if they start at the same position.
                    // Make sure we don't try to print them multiple times.
                    $commentStartPos = $itemStartPos;
                }

                if ($skipRemovedNode) {
                    if ($isStmtList && $this->origTokens->haveBracesInRange($pos, $itemStartPos)) {
                        // We'd remove the brace of a code block.
                        // TODO: Preserve formatting.
                        $this->setIndentLevel($origIndentLevel);
                        return null;
                    }
                } else {
                    $result .= $this->origTokens->getTokenCode(
                        $pos, $commentStartPos, $indentAdjustment);
                }

                if (!empty($delayedAdd)) {
                    /** @var Node $delayedAddNode */
                    foreach ($delayedAdd as $delayedAddNode) {
                        if ($insertNewline) {
                            $delayedAddComments = $delayedAddNode->getComments();
                            if ($delayedAddComments) {
                                $result .= $this->pComments($delayedAddComments) . $this->nl;
                            }
                        }

                        $this->safeAppend($result, $this->p($delayedAddNode, true));

                        if ($insertNewline) {
                            $result .= $insertStr . $this->nl;
                        } else {
                            $result .= $insertStr;
                        }
                    }

                    $delayedAdd = [];
                }

                if ($comments !== $origComments) {
                    if ($comments) {
                        $result .= $this->pComments($comments) . $this->nl;
                    }
                } else {
                    $result .= $this->origTokens->getTokenCode(
                        $commentStartPos, $itemStartPos, $indentAdjustment);
                }

                // If we had to remove anything, we have done so now.
                $skipRemovedNode = false;
            } elseif ($diffType === DiffElem::TYPE_ADD) {
                if (null === $insertStr) {
                    // We don't have insertion information for this list type
                    return null;
                }

                if ($insertStr === ', ' && $this->isMultiline($origNodes)) {
                    $insertStr = ',';
                    $insertNewline = true;
                }

                if ($beforeFirstKeepOrReplace) {
                    // Will be inserted at the next "replace" or "keep" element
                    $delayedAdd[] = $arrItem;
                    continue;
                }

                $itemStartPos = $pos;
                $itemEndPos = $pos - 1;

                $origIndentLevel = $this->indentLevel;
                $this->setIndentLevel($lastElemIndentLevel);

                // ---- CHANGED
                if ($insertNewline) {
                    $result .= $insertStr . $this->nl;
                    $comments = $arrItem->getComments();
                    if ($comments) {
                        $result .= $this->pComments($comments) . $this->nl;
                    }
                    // ---- CHANGED
                } else {
                    $result .= $insertStr;
                }
            } elseif ($diffType === DiffElem::TYPE_REMOVE) {
                if (!$origArrItem instanceof Node) {
                    // We only support removal for nodes
                    return null;
                }

                $itemStartPos = $origArrItem->getStartTokenPos();
                $itemEndPos = $origArrItem->getEndTokenPos();
                \assert($itemStartPos >= 0 && $itemEndPos >= 0);

                // Consider comments part of the node.
                $origComments = $origArrItem->getComments();
                if ($origComments) {
                    $itemStartPos = $origComments[0]->getStartTokenPos();
                }

                if ($i === 0) {
                    // If we're removing from the start, keep the tokens before the node and drop those after it,
                    // instead of the other way around.
                    $result .= $this->origTokens->getTokenCode(
                        $pos, $itemStartPos, $indentAdjustment);
                    $skipRemovedNode = true;
                } else {
                    if ($isStmtList && $this->origTokens->haveBracesInRange($pos, $itemStartPos)) {
                        // We'd remove the brace of a code block.
                        // TODO: Preserve formatting.
                        return null;
                    }
                }

                $pos = $itemEndPos + 1;
                continue;
            } else {
                throw new \Exception("Shouldn't happen");
            }

            if (null !== $fixup && $arrItem->getAttribute('origNode') !== $origArrItem) {
                $res = $this->pFixup($fixup, $arrItem, null, $itemStartPos, $itemEndPos);
            } else {
                $res = $this->p($arrItem, true);
            }
            $this->safeAppend($result, $res);

            $this->setIndentLevel($origIndentLevel);
            $pos = $itemEndPos + 1;
        }

        if ($skipRemovedNode) {
            // TODO: Support removing single node.
            return null;
        }

        if (!empty($delayedAdd)) {
            if (!isset($this->emptyListInsertionMap[$mapKey])) {
                return null;
            }

            [$findToken, $extraLeft, $extraRight] = $this->emptyListInsertionMap[$mapKey];
            if (null !== $findToken) {
                $insertPos = $this->origTokens->findRight($pos, $findToken) + 1;
                $result .= $this->origTokens->getTokenCode($pos, $insertPos, $indentAdjustment);
                $pos = $insertPos;
            }

            $first = true;
            $result .= $extraLeft;
            foreach ($delayedAdd as $delayedAddNode) {
                if (!$first) {
                    $result .= $insertStr;
                }
                $result .= $this->p($delayedAddNode, true);
                $first = false;
            }
            $result .= $extraRight;
        }

        return $result;
    }
}