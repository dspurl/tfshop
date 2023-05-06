<?php
include_once 'common.php';
/**
 * 执行安装
 */
$return = [
    'code' => 0,
    'msgCode' => '安装失败'
];
$shell = '';
$envFile = file_get_contents("../../../.env");
$envArr = [];
// 创建连接
$envFile = explode("\n", $envFile);
foreach ($envFile as $e) {
    if ($e) {
        $explode = explode("=", str_replace("\r", '', $e));
        $envArr[$explode[0]] = $explode[1];
    }
}
switch ($_GET['step']) {
    case 1: //第一步：安装数据表
        $link = new mysqli($envArr['DB_HOST'] . ':' . $envArr['DB_PORT'], $envArr['DB_USERNAME'], $envArr['DB_PASSWORD']);
        if ($link->connect_error) {
            $return = [
                'code' => 0,
                'msgCode' => "连接失败：" . $link->connect_error,
                'msg' => $shell
            ];
        } else {
            $link->query("CREATE DATABASE " . $envArr['DB_DATABASE']);
            $shell .= sellCode('php artisan migrate');
            $return = [
                'code' => 0,
                'msgCode' => '未知错误',
                'msg' => $shell
            ];
            if (strstr($shell, "Unknown database")) {
                $return = [
                    'code' => 0,
                    'msgCode' => '请先创建数据库',
                    'msg' => $shell
                ];
            } else if (strstr($shell, "Access denied for user")) {
                $return = [
                    'code' => 0,
                    'msgCode' => '数据库连接失败，请查看用户名密码是否正确',
                    'msg' => $shell
                ];
            } else if (strstr($shell, "No address associated with hostname")) {
                $return = [
                    'code' => 0,
                    'msgCode' => '数据库连接失败，请查看连接地址是否正确',
                    'msg' => $shell
                ];
            } else if (strstr($shell, "Migration table created successfully.") || strstr($shell, "Nothing to migrate.")) {
                $return = [
                    'code' => 1,
                    'step' => 2,
                    'msg' => PHP_EOL . '数据表安装成功' . PHP_EOL,
                ];
            }
        }
        break;
    case 2: //第二步：添加demo数据
        $shell .= sellCode('php artisan generate:sql');
        $shell .= sellCode('php artisan storage:link');
        $return = [
            'code' => 1,
            'step' => 3,
            'msg' => PHP_EOL . 'demo数据添加成功' . PHP_EOL,
        ];
        break;
    case 3: //第三步：生成APP_KEY
        $shell .= sellCode('php artisan key:generate');
        $return = [
            'code' => 0,
            'msgCode' => '未知错误',
            'msg' => $shell
        ];
        if (strstr($shell, "Application key set successfully")) {
            $return = [
                'code' => 1,
                'step' => 4,
                'msg' => PHP_EOL . 'APP_KEY密钥生成成功' . PHP_EOL,
            ];
        }
        break;
    case 4: //第四步：生成oauth密钥
        $shell .= sellCode('php artisan passport:keys --force');
        $return = [
            'code' => 0,
            'msgCode' => '未知错误',
            'msg' => $shell
        ];
        if (strstr($shell, "Encryption keys generated successfully")) {
            $return = [
                'code' => 1,
                'step' => 5,
                'msg' => PHP_EOL . 'oauth密钥生成成功' . PHP_EOL,
            ];
        }
        break;
    case 5: //第五步：生成OAuth令牌
        $env = file_get_contents("../../../.env");
        $return = [
            'code' => 0,
            'msgCode' => '未知错误',
            'msg' => $shell
        ];
        if (!strstr($env, "PASSPORT_CLIENT_ID=1")) {
            $shell .= sellCode('php artisan passport:client --password --provider=admins');
            if (strstr($shell, "Password grant client created successfully")) {
                $content = explode("\n", $shell);
                foreach ($content as $c) {
                    if (strstr($c, "Client ID:")) {
                        $env = str_replace("PASSPORT_CLIENT_ID=", "PASSPORT_CLIENT_ID=" . trim(explode(":", $c)[1]), $env);
                    } else if (strstr($c, "Client secret:")) {
                        $env = str_replace("PASSPORT_CLIENT_SECRET=", "PASSPORT_CLIENT_SECRET=" . trim(explode(":", $c)[1]), $env);
                    }
                }
                file_put_contents("../../../.env", $env);
                $return = [
                    'code' => 1,
                    'step' => 6,
                    'msg' => PHP_EOL . 'OAuth令牌生成成功' . PHP_EOL,
                ];
            }
        }
        $env = file_get_contents("../../../.env");
        if (!strstr($env, "PASSPORT_WEB_ID=2")) {
            $shell .= sellCode('php artisan passport:client --password --provider=users');
            if (strstr($shell, "Password grant client created successfully")) {
                $content = explode("\n", $shell);
                foreach ($content as $c) {
                    if (strstr($c, "Client ID:")) {
                        $env = str_replace("PASSPORT_WEB_ID=", "PASSPORT_WEB_ID=" . trim(explode(":", $c)[1]), $env);
                    } else if (strstr($c, "Client secret:")) {
                        $env = str_replace("PASSPORT_WEB_SECRET=", "PASSPORT_WEB_SECRET=" . trim(explode(":", $c)[1]), $env);
                    }
                }
                file_put_contents("../../../.env", $env);
                $return = [
                    'code' => 1,
                    'step' => 6,
                    'msg' => PHP_EOL . 'OAuth令牌生成成功' . PHP_EOL,
                ];
            }
        }
        break;
    case 6: //第六步：生成资源路径迁移
        $shell .= sellCode('php artisan resource:migration ' . $envArr['APP_URL']);
        $return = [
            'code' => 1,
            'step' => 7,
            'msg' => PHP_EOL . '资源路径迁移成功' . PHP_EOL,
        ];
    case 7: //第七步：生成后台、小程序和H5
        alternateDomainName('admin/static/js', $envArr);
        alternateDomainName('h5/static/js', $envArr);
        alternateDomainName('mp-weixin/common', $envArr);
        alternateDomainName('platform/js', $envArr);
        alternateDomainName('template/static/js', $envArr);
        $return = [
            'code' => 1,
            'step' => 'end',
            'msg' => PHP_EOL . '生成后台、小程序和H5成功' . PHP_EOL,
        ];
}
echo resReturn($return);
