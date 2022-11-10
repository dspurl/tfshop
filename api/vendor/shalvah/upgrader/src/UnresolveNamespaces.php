<?php

namespace Shalvah\Upgrader;

use PhpParser\Node;
use PhpParser\NodeVisitor;

class UnresolveNamespaces implements NodeVisitor
{
    public function leaveNode(Node $node) {
        if ($node instanceof Node\Name\FullyQualified) {
            return $node->getAttribute('originalName', $node);
        }
    }

    public function beforeTraverse(array $nodes) {}

    public function enterNode(Node $node) {}

    public function afterTraverse(array $nodes) {}
}