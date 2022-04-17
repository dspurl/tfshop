<?php $this->layout('template', array('title' => 'User Profile')) ?>

<?php $this->start('page') ?>
<h1>Welcome!</h1>
<p>Hello <?php echo $this->e($name)?></p>
<?php $this->stop() ?>

<?php $this->start('sidebar') ?>
<ul>
    <li><a href="/link">Example Link</a></li>
    <li><a href="/link">Example Link</a></li>
    <li><a href="/link">Example Link</a></li>
    <li><a href="/link">Example Link</a></li>
    <li><a href="/link">Example Link</a></li>
</ul>
<?php $this->stop() ?>
