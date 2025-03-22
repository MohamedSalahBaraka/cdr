"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DataBase_1 = __importDefault(require("../DataBase"));
const Tabels_1 = require("../Constants/Tabels");
class CDRLog {
    constructor(accountcode, dst, src, dcontext, clid, channel, dstchannel, lastapp, lastdata, start, answer, end, duration, billsec, disposition, amaflags, uniqueid, userfieldchanned_ext, dstchannel_ext, service, caller_name, recordfiles, dstanswer, session, action_owner, action_type, src_trunk_name, dst_trunk_name) {
        this.accountcode = accountcode;
        this.dst = dst;
        this.src = src;
        this.dcontext = dcontext;
        this.clid = clid;
        this.channel = channel;
        this.dstchannel = dstchannel;
        this.lastapp = lastapp;
        this.lastdata = lastdata;
        this.start = start;
        this.answer = answer;
        this.end = end;
        this.duration = duration;
        this.billsec = billsec;
        this.disposition = disposition;
        this.amaflags = amaflags;
        this.uniqueid = uniqueid;
        this.userfieldchanned_ext = userfieldchanned_ext;
        this.dstchannel_ext = dstchannel_ext;
        this.service = service;
        this.caller_name = caller_name;
        this.recordfiles = recordfiles;
        this.dstanswer = dstanswer;
        this.session = session;
        this.action_owner = action_owner;
        this.action_type = action_type;
        this.src_trunk_name = src_trunk_name;
        this.dst_trunk_name = dst_trunk_name;
    }
    static async create(model) {
        try {
            await DataBase_1.default.create({ ...model }, Tabels_1.CDR_LOGS_TABLE);
            return model.uniqueid;
        }
        catch (error) {
            throw error;
        }
    }
    static async get() {
        try {
            const CDRLogs = await DataBase_1.default.getAll(Tabels_1.CDR_LOGS_TABLE);
            return CDRLogs;
        }
        catch (error) {
            throw error;
        }
    }
    static async delete(id) {
        try {
            await DataBase_1.default.deleteById(id, Tabels_1.CDR_LOGS_TABLE);
        }
        catch (error) {
            throw error;
        }
    }
}
exports.default = CDRLog;
