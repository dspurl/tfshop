<?php

namespace Shalvah\Clara\Tests;

use Eloquent\Phony\Phpunit\Phony;
use PHPUnit\Framework\TestCase;
use Shalvah\Clara\Clara;
use Symfony\Component\Console\Output\NullOutput;

class ClaraTest extends TestCase
{

    protected function setUp(): void
    {
        parent::setUp();
        Clara::reset();
    }

    public function test_helper_works()
    {
        $app1 = clara('app1');
        $app1->line("App 1 - Output 1");

        $this->assertInstanceOf(Clara::class, $app1);
    }

    public function test_mute_without_args_mutes_all()
    {
        $handle = Phony::mock(NullOutput::class);
        $nullOutput = $handle->get();
        $app1 = clara('app1')->useOutput($nullOutput);
        $app2 = clara('app2')->useOutput($nullOutput);

        $app1->line("App 1 - Output 1");

        Clara::mute();

        $app1->line("App 1 - Output 2");
        $app2->line("App 2 - Output 1");

        $handle->writeln->once()->called();
        $handle->writeln->firstCall()->calledWith("App 1 - Output 1");
    }

    public function test_mute_with_arg_mutes_only_app()
    {
        $handle = Phony::mock(NullOutput::class);
        $nullOutput = $handle->get();

        $app1 = clara('app1')->useOutput($nullOutput);
        $app2 = clara('app2')->useOutput($nullOutput);

        $app1->line("App 1 - Output 1");

        Clara::mute('app1');
        $app1->line("App 1 - Output 2");

        $app2->line("App 2 - Output 1");

        $handle->writeln->twice()->called();
        $handle->writeln->firstCall()->calledWith("App 1 - Output 1");
        $handle->writeln->lastCall()->calledWith("App 2 - Output 1");
    }

    public function test_unmute_without_args_unmutes_all()
    {
        $handle = Phony::mock(NullOutput::class);
        $nullOutput = $handle->get();
        $app1 = clara('app1')->useOutput($nullOutput);
        $app2 = clara('app2')->useOutput($nullOutput);

        Clara::mute();
        $app1->line("App 1 - Output 1");
        $app2->line("App 2 - Output 1");

        Clara::unmute();
        $app1->line("App 1 - Output 2");
        $app2->line("App 2 - Output 2");

        $handle->writeln->twice()->called();
        $handle->writeln->firstCall()->calledWith("App 1 - Output 2");
        $handle->writeln->lastCall()->calledWith("App 2 - Output 2");

        Clara::mute('app1');
        $app1->line("App 1 - Output 3");

        Clara::unmute();
        $app1->line("App 1 - Output 4");

        $handle->writeln->thrice()->called();
        $handle->writeln->lastCall()->calledWith("App 1 - Output 4");
    }

    public function test_unmute_with_arg_unmutes_only_app()
    {
        $handle = Phony::mock(NullOutput::class);
        $nullOutput = $handle->get();
        $app1 = clara('app1')->useOutput($nullOutput);
        $app2 = clara('app2')->useOutput($nullOutput);

        Clara::mute();
        $app1->line("App 1 - Output 1");
        $app2->line("App 2 - Output 1");

        Clara::unmute('app2');
        $app1->line("App 1 - Output 2");
        $app2->line("App 2 - Output 2");

        $handle->writeln->once()->called();
        $handle->writeln->lastCall()->calledWith("App 2 - Output 2");
    }

    public function test_captures_output_when_start_is_called()
    {
        $nullOutput = new NullOutput;
        $app1 = clara('app1')->useOutput($nullOutput);
        $app2 = clara('app2')->useOutput($nullOutput);

        $app1->line("App 1 - Output 1");
        $captured1 = Clara::getCapturedOutput('app1');
        $this->assertEmpty($captured1);

        Clara::startCapturingOutput('app1');
        $app1->line("App 1 - Output 2");
        $app1->line("App 1 - Output 3");
        $app2->line("App 2 - Output 1");
        $captured1 = Clara::getCapturedOutput('app1');
        $this->assertEquals(2, count($captured1));
        $this->assertEquals("App 1 - Output 2", $captured1[0]);
        $this->assertEquals("App 1 - Output 3", $captured1[1]);
    }

    public function test_stops_capturing_output_when_stop_is_called()
    {
        $nullOutput = new NullOutput;
        $app1 = clara('app1')->useOutput($nullOutput);

        Clara::startCapturingOutput('app1');
        $app1->line("App 1 - Output 1");
        $captured1 = Clara::getCapturedOutput('app1');
        $this->assertEquals(1, count($captured1));
        $this->assertEquals("App 1 - Output 1", $captured1[0]);

        Clara::stopCapturingOutput('app1');
        $app1->line("App 1 - Output 2");

        $captured1 = Clara::getCapturedOutput('app1');
        $this->assertEquals(1, count($captured1));
        $this->assertEquals("App 1 - Output 1", $captured1[0]);
    }

    public function test_does_not_clear_captured_output_until_clear_is_called()
    {
        $nullOutput = new NullOutput;
        $app1 = clara('app1')->useOutput($nullOutput);

        Clara::startCapturingOutput('app1');
        $app1->line("App 1 - Output 1");
        $app1->line("App 1 - Output 2");
        $captured1 = Clara::getCapturedOutput('app1');

        $this->assertEquals(2, count($captured1));
        $this->assertEquals("App 1 - Output 1", $captured1[0]);
        $this->assertEquals("App 1 - Output 2", $captured1[1]);

        Clara::clearCapturedOutput("app1");
        $captured1 = Clara::getCapturedOutput('app1');
        $this->assertEmpty($captured1);
    }

    public function test_allows_user_turn_off_showing_debug_output()
    {
        $handle = Phony::mock(NullOutput::class);
        $nullOutput = $handle->get();
        $app1 = clara('app1')->useOutput($nullOutput);

        $app1->debug("App 1 - Output 1");

        $app1->hideDebugOutput();
        $app1->debug("App 1 - Output 2");

        $app1->showDebugOutput();
        $app1->debug("App 1 - Output 3");

        $handle->writeln->twice()->called();
        $this->assertStringContainsString("App 1 - Output 1", $handle->writeln->firstCall()->argument());
        $this->assertStringContainsString("App 1 - Output 3", $handle->writeln->lastCall()->argument());
    }
}