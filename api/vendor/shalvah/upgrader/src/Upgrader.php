<?php


namespace Shalvah\Upgrader;

use Illuminate\Support\Arr;
use PhpParser;
use PhpParser\{Node,
    Node\Stmt,
    Node\Expr};

class Upgrader
{
    use ReadsAndWritesAsts, ComparesAstNodes, ModifiesAsts;

    public const CHANGE_REMOVED = 'removed';
    public const CHANGE_MOVED = 'moved';
    public const CHANGE_ADDED = 'added';
    public const CHANGE_LIST_ITEM_ADDED = 'added_to_list';

    protected array $changes = [];
    protected array $configFiles = [];
    protected array $movedKeys = [];
    protected array $dontTouchKeys = [];

    /** @var Stmt[] */
    protected ?array $userOldConfigFileAst = [];
    /** @var Stmt[] */
    protected ?array $sampleNewConfigFileAst = [];

    public function __construct(string $userOldConfigRelativePath, string $sampleNewConfigAbsolutePath)
    {
        $this->configFiles['user_old'] = $userOldConfigRelativePath;
        $this->configFiles['sample_new'] = $sampleNewConfigAbsolutePath;
    }

    public static function ofConfigFile(string $userOldConfigRelativePath, string $sampleNewConfigAbsolutePath): self
    {
        return new self($userOldConfigRelativePath, $sampleNewConfigAbsolutePath);
    }

    public function move(string $oldKey, string $newKey): self
    {
        $this->movedKeys[$oldKey] = $newKey;
        return $this;
    }

    /**
     * "Don't touch" these config items.
     * Useful if they contain arrays with keys specified by the user,
     * or lists with values provided entirely by the user
     */
    public function dontTouch(string ...$keys): self
    {
        $this->dontTouchKeys += $keys;
        return $this;
    }

    public function dryRun(): array
    {
        return $this->fetchChanges();
    }

    public function upgrade()
    {
        $this->fetchChanges();
        $upgradedConfig = $this->applyChanges();
        $this->writeAstToFile($upgradedConfig, $this->configFiles['user_old']);
    }

    protected function fetchChanges(): array
    {
        if (!empty($this->changes)) {
            return $this->changes;
        }

        [$userCurrentConfigFile, $sampleNewConfigFile] = $this->parseConfigFiles();

        $userCurrentConfigArray = Arr::first(
            $userCurrentConfigFile, fn(Node $node) => $node instanceof Stmt\Return_
        )->expr->items;
        $sampleNewConfigArray = Arr::first(
            $sampleNewConfigFile, fn(Node $node) => $node instanceof Stmt\Return_
        )->expr->items;
        $this->fetchAddedItems($userCurrentConfigArray, $sampleNewConfigArray);
        $this->fetchRemovedAndMovedItems($userCurrentConfigArray, $sampleNewConfigArray);
        return $this->changes;
    }

    /**
     * @param Expr\ArrayItem[] $userCurrentConfig
     * @param Expr\ArrayItem[] $incomingConfig
     */
    protected function fetchAddedItems(
        array $userCurrentConfig, array $incomingConfig, string $rootKey = ''
    )
    {
        if ($this->arrayIsList($incomingConfig)) {
            // We're dealing with a list of items (numeric array)
            $diff = $this->subtractOtherListFromList($incomingConfig, $userCurrentConfig);
            foreach ($diff as $item) {
                $this->changes[] = [
                    'type' => self::CHANGE_LIST_ITEM_ADDED,
                    'key' => $rootKey,
                    'value' => $item['ast']->value,
                    'description' => "- '{$item['text']}' will be added to `$rootKey`.",
                ];
            }
            return;
        }

        // TODO handle cases of mixed assoc- and list array
        foreach ($incomingConfig as $arrayItem) {
            // @phpstan-ignore-next-line Not yet sure how to handle mixed
            $key = $arrayItem->key->value;
            $value = $arrayItem->value;

            $fullKey = $this->getFullKey($key, $rootKey);
            if ($this->shouldntTouch($fullKey)) {
                continue;
            }

            // Key is in new, but not in old
            if (!$this->hasItem($userCurrentConfig, $key)) {
                $this->changes[] = [
                    'type' => self::CHANGE_ADDED,
                    'key' => $fullKey,
                    'description' => "- `{$fullKey}` will be added.",
                    'value' => $value,
                    'item' => $this->getItem($incomingConfig, $key),
                ];
            } else {
                if ($this->expressionNodeIsArray($value)) {
                    // Key is in both old and new; recurse into array and compare the inner items
                    $this->fetchAddedItems(
                    // @phpstan-ignore-next-line PHPStan doesn't yet support ??
                        $this->getItem($userCurrentConfig, $key)->value->items ?? [], $value->items ?? [], $fullKey
                    );
                }
            }

        }
    }

    /**
     * @param Expr\ArrayItem[] $userCurrentConfig
     * @param Expr\ArrayItem[]|null $incomingConfig
     */
    protected function fetchRemovedAndMovedItems(
        array $userCurrentConfig, $incomingConfig, string $rootKey = ''
    )
    {
        if ($this->arrayIsList($incomingConfig)) {
            // A list of items (numeric array)
            // We only add, not remove.
            return;
        }

        // Loop over the old config
        // TODO handle cases of mixed assoc- and list array
        foreach ($userCurrentConfig as $arrayItem) {
            // @phpstan-ignore-next-line Not yet sure how to handle mixed
            $key = $arrayItem->key->value;
            $value = $arrayItem->value;

            $fullKey = $this->getFullKey($key, $rootKey);

            // Key is in old, but was moved somewhere else in new
            if ($this->wasKeyMoved($fullKey)) {
                $this->changes[] = [
                    'type' => self::CHANGE_MOVED,
                    'key' => $fullKey,
                    'new_key' => $this->movedKeys[$fullKey],
                    'description' => "- `$fullKey` will be moved to `{$this->movedKeys[$fullKey]}`.",
                    'new_value' => $value,
                ];
                continue;
            }

            // Key is in old, but not in new
            if (!$this->hasItem($incomingConfig, $key)) {
                $this->changes[] = [
                    'type' => self::CHANGE_REMOVED,
                    'key' => $fullKey,
                    'description' => "- `$fullKey` will be removed.",
                ];
                continue;
            }

            if (!$this->shouldntTouch($fullKey) && $this->expressionNodeIsArray($value)) {
                // Key is in both old and new; recurse into array and compare the inner items
                $this->fetchRemovedAndMovedItems(
                // @phpstan-ignore-next-line PHPStan doesn't yet support ??
                    $value->items ?? [], $this->getItem($incomingConfig, $key)->value->items ?? [], $fullKey
                );
            }
        }
    }

    protected function wasKeyMoved(string $oldKey): bool
    {
        return array_key_exists($oldKey, $this->movedKeys);
    }

    protected function shouldntTouch(string $key): bool
    {
        return in_array($key, $this->dontTouchKeys);
    }

    /**
     * Resolve config item key with dot notation
     */
    private function getFullKey(string $key, string $rootKey = ''): string
    {
        if (empty($rootKey)) {
            return $key;
        }

        return "$rootKey.$key";
    }

    public function parseConfigFiles(): array
    {
        $userCurrentConfig = $this->getUserOldConfigFileAsAst();
        $incomingConfig = $this->getSampleNewConfigFileAsAst();

        return [$userCurrentConfig, $incomingConfig];
    }

    protected function getUserOldConfigFileAsAst(): array
    {
        if (!empty($this->userOldConfigFileAst)) {
            return $this->userOldConfigFileAst;
        }

        $this->userOldConfigFileAst = $this->parseFilePreservingFormat($this->configFiles['user_old']);
        return $this->userOldConfigFileAst;
    }

    protected function getSampleNewConfigFileAsAst(): array
    {
        if (!empty($this->sampleNewConfigFileAst)) {
            return $this->sampleNewConfigFileAst;
        }

        $this->sampleNewConfigFileAst = $this->parseFile($this->configFiles['sample_new']);
        return $this->sampleNewConfigFileAst;
    }

    protected function applyChanges(): array
    {
        $userConfigAst = $this->getUserOldConfigFileAsAst();
        $configArray =& Arr::first(
            $userConfigAst, fn(Node $node) => $node instanceof Stmt\Return_
        )->expr->items;

        foreach ($this->changes as $change) {
            switch ($change['type']) {
                case self::CHANGE_ADDED:
                    $this->addKey($configArray, $change['key'], $change['item']);
                    break;
                case self::CHANGE_REMOVED:
                    $this->deleteKey($configArray, $change['key']);
                    break;
                case self::CHANGE_MOVED:
                    // Move old value to new key
                    $this->setValue($configArray, $change['new_key'], $change['new_value']);
                    // Then delete old key
                    $this->deleteKey($configArray, $change['key']);
                    break;
                case self::CHANGE_LIST_ITEM_ADDED:
                    $this->pushItemOntoList($configArray, $change['key'], $change['value']);
                    break;
            }
        }

        return $userConfigAst;
    }
}