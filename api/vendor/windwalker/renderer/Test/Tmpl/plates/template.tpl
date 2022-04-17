<html>
<head>
    <title><?php echo $this->e($title)?></title>
</head>
<body>

<img src="logo.png">

<div id="page">
    <?php echo $this->section('page')?>
</div>

<div id="sidebar">
    <?php if ($this->section('sidebar')): ?>
    <?php echo $this->section('sidebar')?>
    <?php else: ?>
    <?php echo $this->fetch('default-sidebar')?>
    <?php endif ?>
</div>

</body>
</html>
