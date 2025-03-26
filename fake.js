"use strict";
// import { faker } from "@faker-js/faker";
// import fs from "fs";
// import CDRLog from "./Models/CDRLog";
// const generateCDR = () => {
//   return {
//     accountcode: "116",
//     dst: faker.phone.number(),
//     src: faker.phone.number(),
//     dcontext: "from-internal",
//     clid: faker.person.fullName(),
//     channel: `SIP/${faker.string.numeric(3)}`,
//     dstchannel: `SIP/${faker.string.numeric(3)}`,
//     lastapp: "Dial",
//     lastdata: "SIP/100,20,Ttr",
//     start: faker.date.past().toISOString(),
//     answer: faker.date.past().toISOString(),
//     end: faker.date.past().toISOString(),
//     duration: faker.number.int({ min: 0, max: 600 }).toString(),
//     billsec: faker.number.int({ min: 0, max: 600 }).toString(),
//     disposition: faker.helpers.arrayElement(["ANSWERED", "NO ANSWER", "FAILED"]),
//     amaflags: "3",
//     uniqueid: faker.string.uuid(),
//     caller_name: faker.person.fullName(),
//     recordfiles: `recording-${faker.string.numeric(4)}.wav`,
//     session: `session-${faker.string.numeric(3)}`,
//     action_owner: "admin",
//     action_type: "CALL",
//     src_trunk_name: `Trunk-${faker.string.numeric(1)}`,
//     dst_trunk_name: `Trunk-${faker.string.numeric(1)}`,
//     dstanswer: faker.string.numeric(1),
//     dstchannel_ext: faker.string.numeric(1),
//     service: faker.string.numeric(1),
//     userfieldchanned_ext: faker.string.numeric(1),
//   };
// };
// export const fake = async () => {
//   const fakeCDRData = Array.from({ length: 50 }, generateCDR); // Generates 100 fake records
//   await Promise.all(
//     fakeCDRData.map(async (cdr) => {
//       await CDRLog.create(cdr);
//     })
//   );
//   console.log("Fake CDR data generated!");
// };
