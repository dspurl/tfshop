<?php
/**
 * Copyright (C) Alibaba Cloud Computing
 * All rights reserved.
 *
 * 版权所有 （C）阿里云计算有限公司
 */

namespace Aliyun\OSS;

use Aliyun\Common\Utilities\AssertUtils;

use Aliyun\Common\Resources\ResourceManager;

use Aliyun\Common\Communication\ServiceClientFactory;

use Aliyun\OSS\Commands\GeneratePresignedUrlCommand;

use Aliyun\OSS\Models\OSSOptions;

/**
 * 访问阿里云开放存储服务（Open Storage Service， OSS）的入口类。
 *
 * @package Aliyun\OSS
 */
class OSSClient {

    /**
     * @var string
     */
    protected $endpoint;

    /**
     * @var array
     */
    protected $credentials;

    /**
     * @var \Aliyun\Common\Communication\ServiceClientInterface
     */
    protected $serviceClient;

    /**
     * 获取OSSClient实例用以访问OSS服务
     *
     * @param array $config Client的配置信息，可以包含下列Key：
     * <li> Endpoint(必选) - OSS服务的Endpoint。必须以"http://"开头。
     * <li> AccessKeyId(必选) - 访问OSS的Access Key ID。 </li>
     * <li> AccessKeySecret(必选) -  访问OSS的Access Key Secret。</li>
     *
     * @return OSSClient
     */
    public static function factory(array $config) {
        return new static($config);
    }

    /**
     * 返回访问OSS的Endpoint。
     *
     * @return string
     */
    public function getEndpoint() {
        return $this->endpoint;
    }

    /**
     * 返回用户的Credentials。
     *
     * @return array 返回的数组中包含AccessKeyId和AccessKeySecret
     */
    public function getCredentials() {
        return $this->credentials;
    }

    /**
     * 返回请求者拥有的所有Bucket
     *
     * @param array $options 默认为空
     *
     * @return array 返回数组包含用户所有的Bucket
     */
    public function listBuckets(array $options = array()) {
        return $this->execute(__FUNCTION__, $options);
    }

    /**
     * 新建一个Bucket
     *
     * @param array $options 请求参数，可以包含以下Key:
     * <li>Bucket(string, 必选) - 新建Bucket的名称</li>
     *
     * @return Models\Bucket
     */
    public function createBucket(array $options) {
        return $this->execute(__FUNCTION__, $options);
    }

    /**
     * 删除一个Bucket
     *
     * @param array $options 请求参数，可以包含以下Key:
     * <li>Bucket(string, 必选) - 所要删除的Bucket的名称</li>
     *
     * @return void
     */
    public function deleteBucket(array $options) {
        return $this->execute(__FUNCTION__, $options);
    }

    /**
     * 获取指定Bucket的访问权限
     *
     * @param array $options 请求参数，可以包含以下Key:
     * <li>Bucket(string, 必选) - 指定的Bucket的名称</li>
     *
     * @return Models\AccessControlPolicy
     */
    public function getBucketAcl(array $options) {
        return $this->execute(__FUNCTION__, $options);
    }

    /**
     * 设置指定Bucket的访问权限
     *
     * @param array $options 请求参数，可以包含以下Key:
     * <li>Bucket(string, 必选) - 指定的Bucket的名称</li>
     * <li>ACL(string, 必选) - Bucket的访问权限，可以为下面几个权限之一： private | public-read | public-read-write </li>
     *
     * @return void
     */
    public function setBucketAcl(array $options) {
        return $this->execute(__FUNCTION__, $options);
    }

    /**
     * 上传一个Object
     *
     * @param array $options 可以包含以下Key:
     * <li>Bucket(string, 必选) - Object所要上传到的Bucket名称</li>
     * <li>Key(string, 必选) - 所要上传Object的Key </li>
     * <li>Content(string|resource, 必选) - 所要上传Object的内容 </li>
     * <li>ContentLength(int, 可选) - 所要上传的Object的大小，如果Content为resource类型，ContentLength为必选</li>
     * <li>ContentDisposition(string, 可选) - Content-Disposition请求头，表示MIME用户代理如何显示附加的文件。</li>
     * <li>CacheControl(string, 可选) - Cache-Control请求头，表示用户指定的HTTP请求/回复链的缓存行为。</li>
     * <li>ContentEncoding(string, 可选) - Content-Encoding请求头，表示Object内容的编码方式。</li>
     * <li><ContentType(string, 可选) - Content-Type请求头，表示Object内容的类型，为标准的MIME类型。</li>
     * <li>Expires(\DateTime, 可选) - Expires请求头，表示Object的过期时间</li>
     * <li>UserMetadata(array, 可选) - 用户自定义元数据，如 array('key1' => 'value1', 'key2' => 'value2') </li>
     *
     * @return Models\PutObjectResult
     */
    public function putObject(array $options) {
        return $this->execute(__FUNCTION__, $options);
    }

    /**
     * 列出指定Bucket下的Object
     *
     * @param array $options 可以包含以下Key:
     * <li>Bucket(string, 必选) - Bucket的名称</li>
     * <li>Prefix(string, 可选) - 限定返回的Object key必须以prefix作为前缀。</li>
     * <li>Marker(string, 可选) - 用户设定结果从marker之后按字母排序的第一个开始返回。</li>
     * <li>MaxKeys(string, 可选) - 用于限定此次返回object的最大数，如果不设定，默认为100。</li>
     * <li>Delimiter(string, 可选) - 用于对Object名字进行分组的字符。</li>
     *
     * @return Models\ObjectListing
     */
    public function listObjects(array $options) {
        return $this->execute(__FUNCTION__, $options);
    }

    /**
     * 获取一个Object
     *
     * @param array $options 可以包含以下Key:
     * <li>Bucket(string, 必选) - Bucket的名称</li>
     * <li>Key(string, 必选) - Object的Key</li>
     * <li>Range(array, 可选) - 指定返回的字节范围，如设定为 array(0, 9) 则返回第0到9个字节的内容</li>
     * <li>SaveAs(string, 可选) - 用于指定Object保存的文件路径，此时返回的OSSObject中content为空。</li>
     * <li>MetaOnly(bool, 可选) - 此项为true的话则只获取Object的元信息而不获取具体内容，默认为false。</li>
     * <li>ModifiedSinceConstraint(\DateTime, 可选) - 如果指定的时间早于实际修改时间，则正常返回Object。</li>
     * <li>UnmodifiedSinceConstraint(\DateTime, 可选) - 如果传入参数中的时间等于或者晚于文件实际修改时间，则正常返回Object。</li>
     * <li>MatchingETagConstraints(array, 可选) - 指定一组ETag，如果传入期望的ETag和object的 ETag匹配，则正常返回Object。</li>
     * <li>NoMatchingETagConstraints(array, 可选) - 指定一组ETag，如果传入的ETag值和Object的ETag不匹配，则正常返回Object。</li>
     * <li>ResponseCacheControl(string, 可选) - 指定返回的Http头Cache-Control</li>
     * <li>ResponseContentDisposition(string, 可选) - 指定返回的Http头Content-Disposition</li>
     * <li>ResponseContentEncoding(string, 可选) - 指定返回的Http头Content-Encoding</li>
     * <li>ResponseContentLanguage(string, 可选) - 指定返回的Http头Content-Language</li>
     * <li>ResponseContentType(string, 可选) - 指定返回的Http头Content-Type</li>
     * <li>ResponseExpires(string, 可选) - 指定返回的Http头Expires</li>
     *
     * @return Models\OSSObject
     */
    public function getObject(array $options) {
        return $this->execute(__FUNCTION__, $options);
    }

    /**
     * 获取Object的元数据，OSSObject中不包含Object的内容
     *
     * @param array $options 可以包含以下Key:
     * <li>Bucket(string, 必选) - Bucket的名称</li>
     * <li>Key(string, 必选) - Object的Key</li>
     * <li>ModifiedSinceConstraint(\DateTime, 可选) - 如果指定的时间早于实际修改时间，则执行复制。</li>
     * <li>UnmodifiedSinceConstraint(\DateTime, 可选) - 如果传入参数中的时间等于或者晚于文件实际修改时间，则执行复制。</li>
     * <li>MatchingETagConstraints(array, 可选) - 指定一组ETag，如果传入期望的ETag和object的 ETag匹配，则执行复制。</li>
     * <li>NoMatchingETagConstraints(array, 可选) - 指定一组ETag，如果传入的ETag值和Object的ETag不匹配，则执行复制。</li>
     *
     * @return Models\OSSObject
     */
    public function getObjectMetadata(array $options) {
        $options[OSSOptions::META_ONLY] = true;
        return $this->getObject($options);
    }

    /**
     * 删除一个Object
     *
     * @param array $options 可以包含以下Key:
     * <li>Bucket(string, 必选) - 要删除的Object所在的Bucket</li>
     * <li>Key(string, 必选) - 要删除的Object的Key</li>
     *
     * @return void
     */
    public function deleteObject(array $options) {
        return $this->execute(__FUNCTION__, $options);
    }

    /**
     * 拷贝一个在OSS上已经存在的Object为另外一个Object。
     *
     * @param array $options 可以包含以下Key:
     * <li>SourceBucket(string, 必选) - 复制的源Bucket</li>
     * <li>SourceKey(string, 必选) - 复制的的源Object的Key</li>
     * <li>DestBucket(string, 必选) - 复制的目的Bucket</li>
     * <li>DestKey(string, 必选) - 复制的目的Object的Key</li>
     * <li>ContentDisposition(string, 可选) - Content-Disposition请求头，表示MIME用户代理如何显示附加的文件。</li>
     * <li>CacheControl(string, 可选) - Cache-Control请求头，表示用户指定的HTTP请求/回复链的缓存行为。</li>
     * <li>ContentEncoding(string, 可选) - Content-Encoding请求头，表示Object内容的编码方式。</li>
     * <li>ContentType(string, 可选) - Content-Type请求头，表示Object内容的类型，为标准的MIME类型。</li>
     * <li>Expires(\DateTime, 可选) - Expires请求头，表示Object的过期时间</li>
     * <li>UserMetadata(array, 可选) - 用户自定义元数据，如 array('key1' => 'value1', 'key2' => 'value2') </li>
     * <p>如果用户在请求中指定了任意一项Object的元数据（ContentDisposition，CacheControl，ContentEncoding，ContentType，Expires， UserMetadata）
     * 则使用新的元数据，否则直接使用源Object的源数据。
     * </p>
     *
     * @return Models\CopyObjectResult
     */
    public function copyObject(array $options) {
        return $this->execute(__FUNCTION__, $options);
    }

    /**
     * 初始化一个Multipart上传事件。
     * <p>
     * 使用Multipart模式上传数据前，必须先调用该接口来通过OSS初始化一个Multipart上传事件。
     * 该接口会返回一个OSS服务器创建的全局唯一的Upload ID，用于标识本次Multipart上传事件。
     * 用户可以根据这个ID来发起相关的操作，如中止、查询Multipart上传等。
     * </p>
     *
     * @param array $options 可以包含以下Key:
     * <li>Bucket(string, 必选) - Object所要分块上传到的Bucket名称</li>
     * <li>Key(string, 必选) - 所要分块上传的Object的Key </li>
     * <li>Content(string|resource, 必选) - 所要上传Object的内容 </li>
     * <li>ContentLength(int, 可选) - 所要上传的Object的大小，如果Content为resource类型，ContentLength为必选</li>
     * <li>ContentDisposition(string, 可选) - Content-Disposition请求头，表示MIME用户代理如何显示附加的文件。</li>
     * <li>CacheControl(string, 可选) - Cache-Control请求头，表示用户指定的HTTP请求/回复链的缓存行为。</li>
     * <li>ContentEncoding(string, 可选) - Content-Encoding请求头，表示Object内容的编码方式。</li>
     * <li><ContentType(string, 可选) - Content-Type请求头，表示Object内容的类型，为标准的MIME类型。</li>
     * <li>Expires(\DateTime, 可选) - Expires请求头，表示Object的过期时间</li>
     * <li>UserMetadata(array, 可选) - 用户自定义元数据，如 array('key1' => 'value1', 'key2' => 'value2') </li>
     *
     * @return Models\InitiateMultipartUploadResult
     */
    public function initiateMultipartUpload(array $options) {
        return $this->execute(__FUNCTION__, $options);
    }

    /**
     * 列出所有执行中的 Multipart上传事件。
     * <p>
     * 即已经被初始化的 Multipart Upload 但是未被完成或被终止的 Multipart上传事件。
     * OSS返回的罗列结果中最多会包含1000个Multipart上传事件。
     * </p>
     *
     * @param array $options 可以包含以下Key:
     * <li>Bucket(string, 必选) - Bucket的名称</li>
     * <li>Delimiter(string, 可选) - 用于对Object名字进行分组的字符。所有名字包含指定的前缀且第一次出现delimiter字符之间的object作为一组元素——CommonPrefixes。</li>
     * <li>KeyMarker(string, 可选) - 设置一个标识表示从哪里返回列表。</li>
     * <li>MaxUploads(string, 可选) - 设置限制的最大返回记录数。最大值和默认值均为1000。</li>
     * <li>Prefix(string, 可选) - 限定返回的object key必须以prefix作为前缀。</li>
     * <li>UploadIdMarker(string, 可选) - 设置一个标识表示从哪里返回列表。</li>
     *
     * @return Models\MultipartUploadsListing
     */
    public function listMultipartUploads(array $options) {
        return $this->execute(__FUNCTION__, $options);
    }

    /**
     * 上传一个分块（Part）到指定的的Multipart上传事件中。
     *
     * @param array $options 可以包含以下Key:
     * <li>Bucket(string, 必选) - Object所要分块上传到的Bucket名称</li>
     * <li>Key(string, 必选) - 所要分块上传的Object的Key </li>
     * <li>UploadId(string, 必选) - 设置标识Multipart上传事件的Upload ID。 </li>
     * <li>Content(string|resource, 必选) - 上传块的内容。<li>
     * <li>ParNumber(int, 必选) - 上传分块（Part）的标识号码</li>
     * <li>PartSize(int, 必选) - 本块的长度</li>
     *
     * @return Models\UploadPartResult
     */
    public function uploadPart(array $options) {
        return $this->execute(__FUNCTION__, $options);
    }

    /**
     * 列出multipart上传事件中上传的所有part信息
     *
     * @param array $options 可以包含以下Key:
     * <li>Bucket(string, 必选) - 上传事件所在Bucket名称</li>
     * <li>Key(string, 必选) - 上传事件的Object的Key </li>
     * <li>UploadId(string, 必选) - 标识Multipart上传事件的Upload ID。 </li>
     * <li>MaxParts(int, 可选) - 设置一个值最大返回多少条记录。最大值和默认值均为1000。</li>
     * <li>PartNumberMarker(int, 可选) - 设置一个值表示从哪个Part号码开始获取列表。</li>
     *
     * @return Models\PartListing
     */
    public function listParts(array $options) {
        return $this->execute(__FUNCTION__, $options);
    }

    /**
     * 撤销一个分块上传的事件
     *
     * @param array $options 可以包含以下Key:
     * <li>Bucket(string, 必选) - 上传事件所在Bucket名称</li>
     * <li>Key(string, 必选) - 上传事件的Object的Key </li>
     * <li>UploadId(string, 必选) - 标识Multipart上传事件的Upload ID。 </li>
     *
     * @return void
     */
    public function abortMultipartUpload(array $options) {
        return $this->execute(__FUNCTION__, $options);
    }

    /**
     * 完成分块上传
     *
     * @param array $options 可以包含以下Key:
     * <li>Bucket(string, 必选) - 上传事件所在Bucket名称</li>
     * <li>Key(string, 必选) - 上传事件的Object的Key </li>
     * <li>UploadId(string, 必选) - 标识Multipart上传事件的Upload ID。 </li>
     * <li>PartETags(array, 必选) - 返回标识上传Part结果的PartETag列表，PartETag也是一个array
     * 里面存在两个元素，分别为PartNumber和ETag。
     * </li>
     *
     * @return Models\CompleteMultipartUploadResult
     */
    public function completeMultipartUpload(array $options) {
        return $this->execute(__FUNCTION__, $options);
    }

    /**
     * 生成预签名URL
     *
     * @param array $options 可以包含以下Key:
     * <li>Bucket(string, 必选) - 签名Object所在的Bucket</li>
     * <li>Key(string, 必选) - 签名的Object的Key </li>
     * <li>Expires(\DateTime, 必选) - 签名过期时间 </li>
     * <li>ContentType(string, 可选) - 签名Object的内容类型 </li>
     * <li>ResponseCacheControl(string, 可选) - 指定返回的Http头Cache-Control （获取Object使用）</li>
     * <li>ResponseContentDisposition(string, 可选) - 指定返回的Http头Content-Disposition（获取Object使用）</li>
     * <li>ResponseContentEncoding(string, 可选) - 指定返回的Http头Content-Encoding（获取Object使用）</li>
     * <li>ResponseContentLanguage(string, 可选) - 指定返回的Http头Content-Language（获取Object使用）</li>
     * <li>ResponseContentType(string, 可选) - 指定返回的Http头Content-Type（获取Object使用）</li>
     * <li>ResponseExpires(string, 可选) - 指定返回的Http头Expires（获取Object使用）</li>
     * <li>UserMetadata(array, 可选) - 用户自定义元数据（上传Object使用），如 array('key1' => 'value1', 'key2' => 'value2') </li>
     *
     * @return mixed
     */
    public function generatePresignedUrl(array $options) {
        $command = new GeneratePresignedUrlCommand(__FUNCTION__);
        return $command->execute($this->getClientOptions(), $options);
    }

    protected function __construct(array $config) {
        // Merge config with default config
        $config = array_merge(
                ResourceManager::getInstance()->getDefaultOptions(__DIR__),
                $config
        );

        // To ensure contains import args
        AssertUtils::assertSet(array(
                OSSOptions::ENDPOINT,
                OSSOptions::ACCESS_KEY_ID,
                OSSOptions::ACCESS_KEY_SECRET,
        ), $config);

        // Config client
        $this->endpoint =  $config[OSSOptions::ENDPOINT];
        $this->credentials = array(
                OSSOptions::ACCESS_KEY_ID => $config[OSSOptions::ACCESS_KEY_ID],
                OSSOptions::ACCESS_KEY_SECRET => $config[OSSOptions::ACCESS_KEY_SECRET],
        );

        // Creat service client
        $this->serviceClient = ServiceClientFactory::factory()->createService($config);
    }

    protected function getClientOptions() {
        return array(
            OSSOptions::ENDPOINT => $this->endpoint,
            OSSOptions::ACCESS_KEY_ID => $this->credentials[OSSOptions::ACCESS_KEY_ID],
            OSSOptions::ACCESS_KEY_SECRET => $this->credentials[OSSOptions::ACCESS_KEY_SECRET],
        );
    }

    protected function execute($method, $options) {
        $className = ucfirst($method).'Command';
        $class = 'Aliyun\\OSS\\Commands\\'.$className;

        $clientOptions = $this->getClientOptions();

        $command = new $class($method);
        $command->setService($this->serviceClient);

        return $command->execute($clientOptions, $options);
    }

}
