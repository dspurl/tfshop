<?php

namespace Shalvah\Upgrader;

use Illuminate\Support\Arr;
use PhpParser\Parser;
use PhpParser\Lexer;
use PhpParser\Node;
use PhpParser\NodeTraverser;
use PhpParser\ParserFactory;
use PhpParser\NodeVisitor;
use PhpParser\PrettyPrinter;
use PhpParser\Node\Stmt;

trait ReadsAndWritesAsts
{

    protected array $originalAst;
    protected array $originalTokens;

    protected function parseFile(string $filePath): array
    {
        $sourceCode = file_get_contents($filePath);
        $parser = (new ParserFactory)->create(ParserFactory::PREFER_PHP7);
        $ast = $parser->parse($sourceCode);
        $traverser = new NodeTraverser();
        $traverser->addVisitor(new NodeVisitor\NameResolver(null, [
            'preserveOriginalNames' => true
        ]));
        return $traverser->traverse($ast);
    }

    protected function parseFilePreservingFormat(string $filePath): array
    {
        $sourceCode = file_get_contents($filePath);

        // Doing this because we need to preserve the formatting when printing later
        $lexer = new Lexer\Emulative([
            'usedAttributes' => [
                'comments', 'startLine', 'endLine', 'startTokenPos', 'endTokenPos',
            ],
        ]);
        $this->originalAst = (new Parser\Php7($lexer))->parse($sourceCode);
        $this->originalTokens = $lexer->getTokens();
        $traverser = new NodeTraverser();
        $traverser->addVisitor(new NodeVisitor\CloningVisitor());
        $traverser->addVisitor(new NodeVisitor\NameResolver(null, [
            'preserveOriginalNames' => true
        ]));

        return $traverser->traverse($this->originalAst);
    }

    /**
     * Print out the changes into the user's config file (saving the old one as a backup)
     */
    protected function writeAstToFile(array $newConfigAst, string $configFilePath)
    {
        $newConfigAst = $this->cleanUpAstForPrinting($newConfigAst);

        $prettyPrinter = new PrettyPrinter\Standard(['shortArraySyntax' => true]);
        $astAsText = $prettyPrinter->printFormatPreserving($newConfigAst, $this->originalAst, $this->originalTokens);

        rename($configFilePath, "$configFilePath.bak");
        file_put_contents($configFilePath, $astAsText);
    }

    /**
     * Shorten namespaces back before printing and add any missing use statements
     */
    protected function cleanUpAstForPrinting(array $ast): array
    {
        $traverser = new NodeTraverser();
        $traverser->addVisitor(new UnresolveNamespaces);
        $ast = $traverser->traverse($ast);

        $sampleConfigAst = $this->getSampleNewConfigFileAsAst();
        $newUseStatements = Arr::where(
            $sampleConfigAst, fn(Node $node) => $node instanceof Stmt\Use_
        );
        $alreadyPresentUseStatements = Arr::where(
            $ast, fn(Node $node) => $node instanceof Stmt\Use_
        );
        $newUseStatements = $this->subtractOtherListFromList($newUseStatements, $alreadyPresentUseStatements);
        foreach ($newUseStatements as $newUseStatement) {
            array_unshift($ast, $newUseStatement['ast']);
        }
        return $ast;
    }
}