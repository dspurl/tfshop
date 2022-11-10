<?php

namespace Shalvah\Upgrader;

use Illuminate\Support\Arr;
use PhpParser\Node;
use PhpParser\Node\Expr;
use PhpParser\PrettyPrinter;

trait ComparesAstNodes
{
    /**
     * @param Expr\ArrayItem[] $arrayItems
     * @param string $key
     *
     * @return mixed
     */
    protected function getItem(array $arrayItems, string $key)
    {
        return Arr::first(
            // @phpstan-ignore-next-line PHPStan doesn't yet support ??
            $arrayItems, fn(Expr\ArrayItem $node) => ($node->key->value ?? null) === $key
        );
    }

    /**
     * @param Expr\ArrayItem[] $arrayItems
     * @param string $key
     *
     * @return bool
     */
    protected function hasItem(array $arrayItems, string $key): bool
    {
        return boolval($this->getItem($arrayItems, $key));
    }

    protected function expressionNodeIsArray(Expr $expressionNode): bool
    {
        return $expressionNode instanceof Expr\Array_;
    }

    /**
     * @param Expr\ArrayItem[] $arrayItems
     *
     * @return bool
     */
    protected function arrayIsList(array $arrayItems): bool
    {
        // List arrays, like ['a', 'b', 'c'] have all `key`s as null when parsed
        return isset($arrayItems[0]) && $arrayItems[0]->key === null;
    }

    /**
     * Get values in $list that are not in $otherList.
     * Replaces array_diff($list, $otherList)
     *
     * @template T of Node
     * @param T[] $list
     * @param T[] $otherList
     *
     * @return array<array{ast: T, text: string}>
     */
    protected function subtractOtherListFromList(array $list, array $otherList): array
    {
        $diff = [];
        // There's no easy way to compare two AST nodes for equality
        // So we'll just convert them to strings and check if they're equal
        $otherListWithItemsAsText = array_map(
            fn($item) => $this->convertAstNodesToText($item), $otherList
        );
        foreach ($list as $item) {
            $itemAsText = $this->convertAstNodesToText($item);
            if (!in_array($itemAsText, $otherListWithItemsAsText)) {
                $diff[] = ['ast' => $item, 'text' => $itemAsText];
            }
        }

        return $diff;
    }

    /**
     * @param Node[]|Node $nodes
     *
     * @return string
     */
    protected function convertAstNodesToText($nodes): string
    {
        $prettyPrinter = new PrettyPrinter\Standard;
        if ($nodes instanceof Expr) {
            return $prettyPrinter->prettyPrintExpr($nodes);
        } else {
            return $prettyPrinter->prettyPrint(Arr::wrap($nodes));
        }
    }
}