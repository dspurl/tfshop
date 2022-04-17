<?php
/**
 * Copyright (C) Alibaba Cloud Computing
 * All rights reserved.
 *
 * 版权所有 （C）阿里云计算有限公司
 */
namespace Aliyun\Common\Resources;

final class ResourceManager {

    const DEFAULT_OPTION_FILENAME = 'default.options.php';
    const DEFAULT_STRINGS_FILENAME = 'strings.php';

    private static $_instance;
	private $globalDefaultOptions;
	private $defaultOptions = array();
    private $strings = null;

	private function __construct() {
		$this->globalDefaultOptions = require __DIR__.'/'.self::DEFAULT_OPTION_FILENAME;
	}

    /**
     * @return ResourceManager
     */
    public static function getInstance() {
		if(! (self::$_instance instanceof self) ) {
			self::$_instance = new self();
		}
		return self::$_instance;
	}

	public function getDefaultOption($key, $serviceDirectory = null) {
        $defaultOptions = $this->getDefaultOptions($serviceDirectory);
	    if (isset($defaultOptions[$key])) {
	        return $defaultOptions[$key];
	    }
	    return null;
	}

    public function getString($string) {

        if ($this->strings == null) {
            $this->strings = require __DIR__.'/'.self::DEFAULT_STRINGS_FILENAME;
        }

        if (!isset($this->strings[$string])) {
            return $string;
        }

        return $this->strings[$string];
    }

	public function getDefaultOptions($serviceDirectory = null) {
	    $defaultOptions = $this->globalDefaultOptions;
	    if ($serviceDirectory !== null) {
	        if (array_key_exists($serviceDirectory, $this->defaultOptions)) {
                $defaultOptions = $this->defaultOptions[$serviceDirectory];
	        } else {
	            $serviceDefaultOptions = require $serviceDirectory.'/Resources/'.self::DEFAULT_OPTION_FILENAME;
                $defaultOptions = array_merge($defaultOptions, $serviceDefaultOptions);
	            $this->clientDefaultOptions[$serviceDirectory] = $defaultOptions;
	        }
	    }
		return $defaultOptions;
	}
}
