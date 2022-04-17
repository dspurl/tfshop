<?php

namespace JohnLui;

require_once __DIR__.'/oss/aliyun.php';

use Aliyun\OSS\OSSClient;
use Aliyun\OSS\Models\OSSOptions;

use Exception;

/**
 * \JohnLui\AliyunOSS
 * 唯一的 manager 类
 */
class AliyunOSS
{
  protected $city;
  protected $networkType;
  protected $ossClient;
  protected $bucket;

  protected $CityURLArray = [
    '杭州' => 'oss-cn-hangzhou',
    '上海' => 'oss-cn-shanghai',
    '青岛' => 'oss-cn-qingdao',
    '北京' => 'oss-cn-beijing',
    '张家口' => 'oss-cn-zhangjiakou',
    '深圳' => 'oss-cn-shenzhen',
    '香港' => 'oss-cn-hongkong',
    '硅谷' => 'oss-us-west-1',
    '弗吉尼亚' => 'oss-us-east-1',
    '新加坡' => 'oss-ap-southeast-1',
    '悉尼' => 'oss-ap-southeast-2',
    '日本' => 'oss-ap-northeast-1',
    '法兰克福' => 'oss-eu-central-1',
    '迪拜' => 'oss-me-east-1',
  ];

  protected $CityURLArrayForVPC = [
    '杭州' => 'vpc100-oss-cn-hangzhou',
    '上海' => 'vpc100-oss-cn-shanghai',
    '青岛' => 'vpc100-oss-cn-qingdao',
    '北京' => 'vpc100-oss-cn-beijing',
    '张家口' => 'oss-cn-zhangjiakou-internal',
    '深圳' => 'vpc100-oss-cn-shenzhen',
    '硅谷' => 'vpc100-oss-us-west-1',
    '弗吉尼亚' => 'oss-us-east-1-internal',
    '新加坡' => 'vpc100-oss-ap-southeast-1',
    '悉尼' => 'vpc100-oss-ap-southeast-2',
    '日本' => 'oss-ap-northeast-1-internal',
    '法兰克福' => 'oss-eu-central-1-internal',
    '迪拜' => 'oss-me-east-1-internal',
  ];

  public function __construct($city, $networkType, $isInternal, $AccessKeyId, $AccessKeySecret)
  {
    $this->city = $city;
    $this->networkType = $networkType;

    $serverAddress = 'http://';
    if ($networkType == '经典网络') {
      if (!array_key_exists($city, $this->CityURLArray)) {
        throw new Exception("城市不存在");
      }
      $serverAddress .= $this->CityURLArray[$city];
      $serverAddress .= $isInternal ? '-internal' : '';
    } else if ($networkType == 'VPC') {
      if (!array_key_exists($city, $this->CityURLArrayForVPC)) {
        throw new Exception("城市不存在");
      }
      $serverAddress .= $this->CityURLArrayForVPC[$city];
    } else {
      throw new Exception("\$networkType 必须是 '经典网络' 或 'VPC'");
    }
    $serverAddress .= '.aliyuncs.com';

    $this->ossClient = OSSClient::factory([
      OSSOptions::ENDPOINT => $serverAddress,
      'AccessKeyId'  => $AccessKeyId,
      'AccessKeySecret' => $AccessKeySecret,
    ]);
  }

  public static function boot($city, $networkType, $isInternal, $AccessKeyId, $AccessKeySecret)
  {
    return new self($city, $networkType, $isInternal, $AccessKeyId, $AccessKeySecret);
  }

  public function setBucket($bucket)
  {
    $this->bucket = $bucket;

    return $this;
  }

  public function uploadFile($key, $file, $options = [])
  {
    $handle = fopen($file, 'r');
    $value  = $this->ossClient->putObject(array_merge([
      'Bucket'        => $this->bucket,
      'Key'           => $key,
      'Content'       => $handle,
      'ContentLength' => filesize($file),
    ], $options));
    fclose($handle);

    return $value;
  }

  public function uploadContent($key, $content, $options = [])
  {
    return $this->ossClient->putObject(array_merge([
      'Bucket'        => $this->bucket,
      'Key'           => $key,
      'Content'       => $content,
      'ContentLength' => strlen($content),
    ], $options));
  }

  public function getPublicUrl($key)
  {
    if ($this->networkType == 'VPC') {
      throw new Exception("经典网络才能获取公开 api");
    }

    if (!array_key_exists($this->city, $this->CityURLArray)) {
      throw new Exception("城市不存在");
    }

    return 'http://'.$this->bucket.'.'.$this->CityURLArray[$this->city].'.aliyuncs.com'.'/'.$key;
  }

  public function getUrl($key, $expire_time)
  {
    return $this->ossClient->generatePresignedUrl([
      'Bucket'  => $this->bucket,
      'Key'     => $key,
      'Expires' => $expire_time,
    ]);
  }

  public function createBucket($bucketName)
  {
    return $this->ossClient->createBucket(['Bucket' => $bucketName]);
  }

  public function getAllObjectKey($bucketName)
  {
    $objectListing = $this->ossClient->listObjects([
      'Bucket' => $bucketName,
    ]);

    $objectKeys = [];
    foreach ($objectListing->getObjectSummarys() as $objectSummary) {
      $objectKeys[] = $objectSummary->getKey();
    }

    return $objectKeys;
  }

  /**
   * 获取指定文件夹下的所有文件
   *
   * @param string $bucketName 存储容器名称
   * @param string $folder_name 文件夹名
   * @return 指定文件夹下的所有文件
   */
  public function getAllObjectKeyWithPrefix($bucketName, $folder_name, $nextMarker = '')
  {
    $objectKeys = [];

    while (true) {
      $objectListing = $this->ossClient->listObjects([
        'Bucket'  => $bucketName,
        'Prefix'  => $folder_name,
        'MaxKeys' => 1000,
        'Marker'  => $nextMarker,
      ]);

      foreach ($objectListing->getObjectSummarys() as $objectSummary) {
        $objectKeys[] = $objectSummary->getKey();
      }

      $nextMarker = $objectListing->getNextMarker();
      if ($nextMarker === '' || is_null($nextMarker)) {
        break;
      }
    }

    return $objectKeys;
  }

  /**
   * 删除阿里云中存储的文件
   *
   * @param string $bucketName 存储容器名称
   * @param string $key 存储key（文件的路径和文件名）
   * @return void
   */
  public function deleteObject($bucketName, $key)
  {
    if ($bucketName === null) {
      $bucketName = $this->bucket;
    }

    return $this->ossClient->deleteObject([
      'Bucket' => $bucketName,
      'Key'    => $key,
    ]);
  }

  /**
   * 复制存储在阿里云OSS中的Object
   *
   * @param string $sourceBuckt 复制的源Bucket
   * @param string $sourceKey - 复制的的源Object的Key
   * @param string $destBucket - 复制的目的Bucket
   * @param string $destKey - 复制的目的Object的Key
   * @return Models\CopyObjectResult
   */
  public function copyObject($sourceBuckt, $sourceKey, $destBucket, $destKey)
  {
    if ($sourceBuckt === null) {
      $sourceBuckt = $this->bucket;
    }
    if ($destBucket === null) {
      $destBucket = $this->bucket;
    }

    return $this->ossClient->copyObject([
      'SourceBucket' => $sourceBuckt,
      'SourceKey'    => $sourceKey,
      'DestBucket'   => $destBucket,
      'DestKey'      => $destKey,
    ]);
  }

  /**
   * 移动存储在阿里云OSS中的Object
   *
   * @param string $sourceBuckt 复制的源Bucket
   * @param string $sourceKey - 复制的的源Object的Key
   * @param string $destBucket - 复制的目的Bucket
   * @param string $destKey - 复制的目的Object的Key
   * @return Models\CopyObjectResult
   */
  public function moveObject($sourceBuckt, $sourceKey, $destBucket, $destKey)
  {
    if ($sourceBuckt === null) {
      $sourceBuckt = $this->bucket;
    }
    if ($destBucket === null) {
      $destBucket = $this->bucket;
    }

    $result = $this->ossClient->copyObject([
      'SourceBucket' => $sourceBuckt,
      'SourceKey'    => $sourceKey,
      'DestBucket'   => $destBucket,
      'DestKey'      => $destKey,
    ]);

    if (is_object($result) && $result->getETag()) {
      $this->deleteObject($sourceBuckt, $sourceKey);
    }

    return $result;
  }

  /**
   * 获取指定存储容器下的某个文件的元信息
   *
   * @param string $bucketName 存储容器名称
   * @param string $key 存储key（文件的路径和文件名）
   * @return
   */
  public function getObjectMeta($bucketName, $key)
  {
    if ($bucketName === null) {
      $bucketName = $this->bucket;
    }

    return $this->ossClient->getObjectMetadata([
      'Bucket' => $bucketName,
      'Key' => $key,
    ]);
  }
}
