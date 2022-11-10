<?php

namespace Shalvah\Upgrader;

use Illuminate\Support\Arr;
use PhpParser\BuilderFactory;
use PhpParser\Node\Expr;
use PhpParser\Node;

trait ModifiesAsts
{
    protected function setValue(array &$allArrayItems, string $dotPath, $newValue)
    {
        $keySegments = explode('.', $dotPath);
        $childKey = array_pop($keySegments);
        $this->findInnerArrayByKey($allArrayItems, $keySegments, function (array $searchArray) use ($childKey, $newValue) {
            $item = Arr::first(
                // @phpstan-ignore-next-line PHPStan doesn't yet support ??
                $searchArray, fn(Expr\ArrayItem $node) => ($node->key->value ?? null) === $childKey
            );
            $item->value = $newValue;
        });
    }

    protected function addKey(array &$allArrayItems, string $dotPath, $newItem)
    {
        $keySegments = explode('.', $dotPath);
        array_pop($keySegments);
        $this->findInnerArrayByKey($allArrayItems, $keySegments, function (array &$searchArray) use ($newItem) {
            $searchArray[] = $newItem;
        });
    }

    protected function deleteKey(array &$allArrayItems, string $dotPath)
    {
        $keySegments = explode('.', $dotPath);
        $childKey = array_pop($keySegments);
        $this->findInnerArrayByKey($allArrayItems, $keySegments, function (array &$searchArray) use ($childKey) {
            foreach ($searchArray as $index => $item) {
                if ($item->key->value === $childKey) {
                    unset($searchArray[$index]);
                }
            }
            $searchArray = array_values($searchArray);
        });
    }

    protected function pushItemOntoList(array &$allArrayItems, string $listDotPath, $newValue)
    {
        $keySegments = explode('.', $listDotPath);
        $this->findInnerArrayByKey($allArrayItems, $keySegments, function (array &$list) use ($newValue) {
            $list[] = new Expr\ArrayItem($newValue, null);
        });
    }

    /**
     * @param Expr\ArrayItem[] $arrayItems
     * @param array $keySegments The dot notation key, split into an array
     * @param callable $callback The operation to be performed on the found array
     */
    protected function findInnerArrayByKey(array &$arrayItems, array $keySegments, callable $callback)
    {
        $searchArray =& $arrayItems;
        while (count($keySegments)) {
            $nextKeySegment = array_shift($keySegments);
            foreach ($searchArray as $item) {
                if (
                    ($item->key instanceof Node\Scalar\String_
                        || $item->key instanceof Node\Scalar\LNumber)
                    && $item->key->value === $nextKeySegment
                ) {
                    $searchArray =& $item->value->items;
                    break;
                }
            }
        }

        $callback($searchArray);
    }
}