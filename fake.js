"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fake = void 0;
const faker_1 = require("@faker-js/faker");
const CDRLog_1 = __importDefault(require("./Models/CDRLog"));
const generateCDR = () => {
    return {
        accountcode: "116",
        dst: faker_1.faker.phone.number(),
        src: faker_1.faker.phone.number(),
        dcontext: "from-internal",
        clid: faker_1.faker.person.fullName(),
        channel: `SIP/${faker_1.faker.string.numeric(3)}`,
        dstchannel: `SIP/${faker_1.faker.string.numeric(3)}`,
        lastapp: "Dial",
        lastdata: "SIP/100,20,Ttr",
        start: faker_1.faker.date.past().toISOString(),
        answer: faker_1.faker.date.past().toISOString(),
        end: faker_1.faker.date.past().toISOString(),
        duration: faker_1.faker.number.int({ min: 0, max: 600 }).toString(),
        billsec: faker_1.faker.number.int({ min: 0, max: 600 }).toString(),
        disposition: faker_1.faker.helpers.arrayElement(["ANSWERED", "NO ANSWER", "FAILED"]),
        amaflags: "3",
        uniqueid: faker_1.faker.string.uuid(),
        caller_name: faker_1.faker.person.fullName(),
        recordfiles: `recording-${faker_1.faker.string.numeric(4)}.wav`,
        session: `session-${faker_1.faker.string.numeric(3)}`,
        action_owner: "admin",
        action_type: "CALL",
        src_trunk_name: `Trunk-${faker_1.faker.string.numeric(1)}`,
        dst_trunk_name: `Trunk-${faker_1.faker.string.numeric(1)}`,
        dstanswer: faker_1.faker.string.numeric(1),
        dstchannel_ext: faker_1.faker.string.numeric(1),
        service: faker_1.faker.string.numeric(1),
        userfieldchanned_ext: faker_1.faker.string.numeric(1),
    };
};
const fake = async () => {
    const fakeCDRData = Array.from({ length: 50 }, generateCDR); // Generates 100 fake records
    await Promise.all(fakeCDRData.map(async (cdr) => {
        await CDRLog_1.default.create(cdr);
    }));
    console.log("Fake CDR data generated!");
};
exports.fake = fake;
