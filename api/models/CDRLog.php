<?php

require_once __DIR__ . '/../config/database.php';

class CDRLog
{
    public static function create($data)
    {
        global $pdo;
        $stmt = $pdo->prepare("INSERT INTO cdr_logs (
            accountcode, dst, src, dcontext, clid, channel, dstchannel,
            lastapp, lastdata, start, answer, end, duration, billsec,
            disposition, amaflags, uniqueid, userfield, dstchannel_ext,
            service, caller_name, session,
            action_owner, action_type, src_trunk_name, dst_trunk_name, new_src, channel_ext, sn
        ) VALUES (
            :AcctId, :dst, :src, :dcontext, :clid, :channel, :dstchannel,
            :lastapp, :lastdata, :start, :answer, :end, :duration, :billsec,
            :disposition, :amaflags, :uniqueid, :userfield, :dstchannel_ext,
            :service, :caller_name, :session,
            :action_owner, :action_type, :src_trunk_name, :dst_trunk_name, :new_src, :channel_ext, :sn
        )");

        $stmt->execute($data);
        return true;
    }
}
