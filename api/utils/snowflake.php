<?php
class Snowflake
{
    private $twepoch = 1288834974657;
    private $sequence = 0;
    private $workerId;
    private $datacenterId;

    private $workerIdBits = 5;
    private $datacenterIdBits = 5;
    private $sequenceBits = 12;

    private $maxWorkerId;
    private $maxDatacenterId;
    private $sequenceMask;

    private $workerIdShift;
    private $datacenterIdShift;
    private $timestampLeftShift;

    private $lastTimestamp = -1;

    public function __construct($workerId, $datacenterId)
    {
        $this->maxWorkerId = -1 ^ (-1 << $this->workerIdBits);
        $this->maxDatacenterId = -1 ^ (-1 << $this->datacenterIdBits);
        $this->sequenceMask = -1 ^ (-1 << $this->sequenceBits);

        $this->workerIdShift = $this->sequenceBits;
        $this->datacenterIdShift = $this->sequenceBits + $this->workerIdBits;
        $this->timestampLeftShift = $this->sequenceBits + $this->workerIdBits + $this->datacenterIdBits;

        if ($workerId > $this->maxWorkerId || $workerId < 0) {
            throw new Exception("workerId must be between 0 and {$this->maxWorkerId}");
        }
        if ($datacenterId > $this->maxDatacenterId || $datacenterId < 0) {
            throw new Exception("datacenterId must be between 0 and {$this->maxDatacenterId}");
        }

        $this->workerId = $workerId;
        $this->datacenterId = $datacenterId;
    }

    public function nextId()
    {
        $timestamp = $this->currentTime();

        if ($timestamp < $this->lastTimestamp) {
            throw new Exception("Clock moved backwards. Refusing to generate ID for " . ($this->lastTimestamp - $timestamp) . " milliseconds");
        }

        if ($this->lastTimestamp === $timestamp) {
            $this->sequence = ($this->sequence + 1) & $this->sequenceMask;
            if ($this->sequence === 0) {
                $timestamp = $this->waitForNextMillis($this->lastTimestamp);
            }
        } else {
            $this->sequence = 0;
        }

        $this->lastTimestamp = $timestamp;

        return (($timestamp - $this->twepoch) << $this->timestampLeftShift) |
            ($this->datacenterId << $this->datacenterIdShift) |
            ($this->workerId << $this->workerIdShift) |
            $this->sequence;
    }

    private function waitForNextMillis($lastTimestamp)
    {
        $timestamp = $this->currentTime();
        while ($timestamp <= $lastTimestamp) {
            $timestamp = $this->currentTime();
        }
        return $timestamp;
    }

    private function currentTime()
    {
        return floor(microtime(true) * 1000);
    }
}

function getid()
{
    $workerId = 1;
    $datacenterId = 1;
    $snowflake = new Snowflake($workerId, $datacenterId);
    return $snowflake->nextId();
}
