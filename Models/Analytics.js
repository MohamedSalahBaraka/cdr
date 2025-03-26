"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DataBase_1 = __importDefault(require("../DataBase"));
const Snowflake_1 = __importDefault(require("../Snowflake"));
const Tabels_1 = require("../Constants/Tabels");
const Alltimedata = "Alltimedata";
class Analytics {
    constructor(id, accountcode, date, total_calls, answered_calls, missed_calls, failed_calls, total_duration, avg_duration, busiest_hour, most_called_number, most_frequent_caller) {
        this.id = id;
        this.accountcode = accountcode;
        this.date = date;
        this.total_calls = total_calls;
        this.answered_calls = answered_calls;
        this.missed_calls = missed_calls;
        this.failed_calls = failed_calls;
        this.total_duration = total_duration;
        this.avg_duration = avg_duration;
        this.busiest_hour = busiest_hour;
        this.most_called_number = most_called_number;
        this.most_frequent_caller = most_frequent_caller;
    }
    static async create(accountcode, date, total_calls, answered_calls, missed_calls, failed_calls, total_duration, avg_duration, busiest_hour, most_called_number, most_frequent_caller) {
        try {
            const id = Snowflake_1.default.nextId();
            const data = await DataBase_1.default.getAll(Tabels_1.CDR_ANALYTICS_TABLE, "*", "", "WHERE date = ? AND accountcode = ?", [date, accountcode]);
            if (data.length > 0) {
                const m = data[0];
                await this.updaterecord({
                    id: data[0].id,
                    accountcode,
                    date,
                    total_calls,
                    answered_calls,
                    missed_calls,
                    failed_calls,
                    total_duration,
                    avg_duration,
                    busiest_hour,
                    most_called_number,
                    most_frequent_caller,
                });
                await this.saveAlltimeData({
                    id: Alltimedata + accountcode,
                    accountcode,
                    date,
                    total_calls: total_calls - m.total_calls,
                    answered_calls: answered_calls - m.answered_calls,
                    missed_calls: missed_calls - m.missed_calls,
                    failed_calls: failed_calls - m.failed_calls,
                    total_duration: total_duration - m.total_duration,
                    avg_duration: avg_duration,
                    busiest_hour,
                    most_called_number,
                    most_frequent_caller,
                });
                await this.saveAlltimeData({
                    id: Alltimedata,
                    accountcode: Alltimedata,
                    date,
                    total_calls: total_calls - m.total_calls,
                    answered_calls: answered_calls - m.answered_calls,
                    missed_calls: missed_calls - m.missed_calls,
                    failed_calls: failed_calls - m.failed_calls,
                    total_duration: total_duration - m.total_duration,
                    avg_duration: avg_duration,
                    busiest_hour,
                    most_called_number,
                    most_frequent_caller,
                });
            }
            //   Not Found
            else {
                await this.createrecord({
                    date,
                    accountcode,
                    id,
                    total_calls,
                    answered_calls,
                    missed_calls,
                    failed_calls,
                    total_duration,
                    avg_duration,
                    busiest_hour,
                    most_called_number,
                    most_frequent_caller,
                });
                await this.saveAlltimeData({
                    id: Alltimedata + accountcode,
                    accountcode,
                    date,
                    total_calls,
                    answered_calls,
                    missed_calls,
                    failed_calls,
                    total_duration,
                    avg_duration,
                    busiest_hour,
                    most_called_number,
                    most_frequent_caller,
                });
                await this.saveAlltimeData({
                    id: Alltimedata,
                    accountcode: Alltimedata,
                    date,
                    total_calls,
                    answered_calls,
                    missed_calls,
                    failed_calls,
                    total_duration,
                    avg_duration,
                    busiest_hour,
                    most_called_number,
                    most_frequent_caller,
                });
            }
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * update data
     */
    static async saveAlltimeData(model) {
        try {
            const data = await DataBase_1.default.getAll(Tabels_1.CDR_ANALYTICS_TABLE, "*", "", "WHERE date = ? AND accountcode = ?", [
                Alltimedata,
                model.accountcode,
            ]);
            const m = data[0];
            if (data.length > 0)
                await this.updaterecord({
                    id: m.id,
                    accountcode: m.accountcode,
                    date: Alltimedata,
                    total_calls: m.total_calls + model.total_calls,
                    answered_calls: m.answered_calls + model.answered_calls,
                    missed_calls: m.missed_calls + model.missed_calls,
                    failed_calls: m.failed_calls + model.failed_calls,
                    total_duration: m.total_duration + model.total_duration,
                    avg_duration: m.answered_calls > 0 ? m.total_duration + model.total_duration / m.answered_calls + 1 : model.total_duration,
                    busiest_hour: "0",
                    most_called_number: Alltimedata,
                    most_frequent_caller: Alltimedata,
                });
            else
                await this.createrecord({
                    id: model.id,
                    accountcode: model.accountcode,
                    date: Alltimedata,
                    total_calls: model.total_calls,
                    answered_calls: model.answered_calls,
                    missed_calls: model.missed_calls,
                    failed_calls: model.failed_calls,
                    total_duration: model.total_duration,
                    avg_duration: model.total_duration,
                    busiest_hour: "0",
                    most_called_number: Alltimedata,
                    most_frequent_caller: Alltimedata,
                });
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * update data
     */
    static async updaterecord(model) {
        try {
            await DataBase_1.default.update(model.id, { ...model }, Tabels_1.CDR_ANALYTICS_TABLE);
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * create data
     */
    static async createrecord(model) {
        try {
            await DataBase_1.default.create({ ...model }, Tabels_1.CDR_ANALYTICS_TABLE);
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * Get analytics for all account codes for the current month.
     */
    static async getMonthlyAnalytics(currentMonth) {
        try {
            // const currentMonth = new Date().toISOString().slice(0, 7); // Format: YYYY-MM
            const data = await DataBase_1.default.getAll(Tabels_1.CDR_ANALYTICS_TABLE, "*", "", "WHERE date LIKE ?", [`${currentMonth}%`]);
            return this.aggregateAnalyticsRecords(data);
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * Get analytics for a specific account code for the current month.
     */
    static async getMonthlyAnalyticsByAccount(currentMonth, accountcode) {
        try {
            // const currentMonth = new Date().toISOString().slice(0, 7); // Format: YYYY-MM
            const data = await DataBase_1.default.getAll(Tabels_1.CDR_ANALYTICS_TABLE, "*", "", "WHERE date LIKE ? AND accountcode = ?", [
                `${currentMonth}%`,
                accountcode,
            ]);
            return this.aggregateAnalyticsRecords(data);
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * Get analytics for all account codes for the current year.
     */
    static async getYearlyAnalytics(currentYear) {
        try {
            // const currentYear = new Date().getFullYear();
            const data = await DataBase_1.default.getAll(Tabels_1.CDR_ANALYTICS_TABLE, "*", "", "WHERE date LIKE ?", [`${currentYear}%`]);
            return this.aggregateAnalyticsRecords(data);
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * Get analytics for a specific account code for the current year.
     */
    static async getYearlyAnalyticsByAccount(currentYear, accountcode) {
        try {
            // const currentYear = new Date().getFullYear();
            const data = await DataBase_1.default.getAll(Tabels_1.CDR_ANALYTICS_TABLE, "*", "", "WHERE date LIKE ? AND accountcode = ?", [
                `${currentYear}%`,
                accountcode,
            ]);
            return this.aggregateAnalyticsRecords(data);
        }
        catch (error) {
            throw error;
        }
    }
    static async getAnalyticsByDateRangeAndAccountCode(startDate, endDate, accountcode) {
        try {
            const data = await DataBase_1.default.getAll(Tabels_1.CDR_ANALYTICS_TABLE, "*", "", "WHERE date >= ? AND date <= ? AND accountcode = ?", [
                startDate,
                endDate,
                accountcode,
            ]);
            console.log(data);
            return this.aggregateAnalyticsRecords(data);
        }
        catch (error) {
            throw error;
        }
    }
    static async getAnalyticsByDateRange(startDate, endDate) {
        try {
            const data = await DataBase_1.default.getAll(Tabels_1.CDR_ANALYTICS_TABLE, "*", "", "WHERE date >= ? AND date <= ?", [startDate, endDate]);
            return this.aggregateAnalyticsRecords(data);
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * Get analytics for all account codes for all time.
     */
    static async getTodayAnalytics() {
        try {
            // Get Today's date in YYYY-MM-DD format
            const Today = new Date();
            const formattedDate = Today.toISOString().split("T")[0];
            // Fetch all call records from the CDR log table for Today
            const logs = await DataBase_1.default.getAll(Tabels_1.CDR_LOGS_TABLE, "*", "", "WHERE DATE(start) = ?", [formattedDate]);
            if (!logs || logs.length === 0)
                return null;
            // Aggregate data by accountcode
            const analyticsData = {};
            logs.forEach((log) => {
                const key = log.accountcode;
                if (!analyticsData[key]) {
                    analyticsData[key] = {
                        accountcode: log.accountcode,
                        date: formattedDate,
                        total_calls: 0,
                        answered_calls: 0,
                        missed_calls: 0,
                        failed_calls: 0,
                        total_duration: 0,
                        busiest_hour_map: {},
                        most_called_map: {},
                        most_frequent_caller_map: {},
                    };
                }
                const data = analyticsData[key];
                data.total_calls++;
                data.total_duration += parseInt(log.duration);
                if (log.disposition === "ANSWERED") {
                    data.answered_calls++;
                }
                else if (log.disposition === "NO ANSWER") {
                    data.missed_calls++;
                }
                else if (log.disposition === "FAILED" || log.disposition === "BUSY") {
                    data.failed_calls++;
                }
                // Track busiest hour
                const hour = log.start.split(" ")[1].split(":")[0]; // Extract hour (HH)
                data.busiest_hour_map[hour] = (data.busiest_hour_map[hour] || 0) + 1;
                // Track most called number
                data.most_called_map[log.dst] = (data.most_called_map[log.dst] || 0) + 1;
                // Track most frequent caller
                data.most_frequent_caller_map[log.src] = (data.most_frequent_caller_map[log.src] || 0) + 1;
            });
            // Process aggregated data and insert using `create` method
            for (const key in analyticsData) {
                const entry = analyticsData[key];
                entry.avg_duration = entry.answered_calls > 0 ? entry.total_duration / entry.answered_calls : 0;
                entry.busiest_hour = Object.keys(entry.busiest_hour_map).reduce((a, b) => (entry.busiest_hour_map[a] > entry.busiest_hour_map[b] ? a : b), "00");
                entry.most_called_number = Object.keys(entry.most_called_map).reduce((a, b) => (entry.most_called_map[a] > entry.most_called_map[b] ? a : b), "");
                entry.most_frequent_caller = Object.keys(entry.most_frequent_caller_map).reduce((a, b) => (entry.most_frequent_caller_map[a] > entry.most_frequent_caller_map[b] ? a : b), "");
                return entry;
            }
        }
        catch (error) {
            throw error;
        }
    }
    static async getTodayAnalyticsByAccount(accountcode) {
        try {
            // Get Today's date in YYYY-MM-DD format
            const Today = new Date();
            const formattedDate = Today.toISOString().split("T")[0];
            // Fetch all call records from the CDR log table for Today
            const logs = await DataBase_1.default.getAll(Tabels_1.CDR_LOGS_TABLE, "*", "", "WHERE DATE(start) = ? AND accountcode = ?", [formattedDate, accountcode]);
            if (!logs || logs.length === 0)
                return null;
            // Aggregate data by accountcode
            const analyticsData = {};
            logs.forEach((log) => {
                const key = log.accountcode;
                if (!analyticsData[key]) {
                    analyticsData[key] = {
                        accountcode: log.accountcode,
                        date: formattedDate,
                        total_calls: 0,
                        answered_calls: 0,
                        missed_calls: 0,
                        failed_calls: 0,
                        total_duration: 0,
                        busiest_hour_map: {},
                        most_called_map: {},
                        most_frequent_caller_map: {},
                    };
                }
                const data = analyticsData[key];
                data.total_calls++;
                data.total_duration += parseInt(log.duration);
                if (log.disposition === "ANSWERED") {
                    data.answered_calls++;
                }
                else if (log.disposition === "NO ANSWER") {
                    data.missed_calls++;
                }
                else if (log.disposition === "FAILED" || log.disposition === "BUSY") {
                    data.failed_calls++;
                }
                // Track busiest hour
                const hour = log.start.split(" ")[1].split(":")[0]; // Extract hour (HH)
                data.busiest_hour_map[hour] = (data.busiest_hour_map[hour] || 0) + 1;
                // Track most called number
                data.most_called_map[log.dst] = (data.most_called_map[log.dst] || 0) + 1;
                // Track most frequent caller
                data.most_frequent_caller_map[log.src] = (data.most_frequent_caller_map[log.src] || 0) + 1;
            });
            // Process aggregated data and insert using `create` method
            for (const key in analyticsData) {
                const entry = analyticsData[key];
                entry.avg_duration = entry.answered_calls > 0 ? entry.total_duration / entry.answered_calls : 0;
                entry.busiest_hour = Object.keys(entry.busiest_hour_map).reduce((a, b) => (entry.busiest_hour_map[a] > entry.busiest_hour_map[b] ? a : b), "00");
                entry.most_called_number = Object.keys(entry.most_called_map).reduce((a, b) => (entry.most_called_map[a] > entry.most_called_map[b] ? a : b), "");
                entry.most_frequent_caller = Object.keys(entry.most_frequent_caller_map).reduce((a, b) => (entry.most_frequent_caller_map[a] > entry.most_frequent_caller_map[b] ? a : b), "");
                return entry;
            }
        }
        catch (error) {
            throw error;
        }
    }
    static async getAllTimeAnalytics() {
        try {
            const data = await DataBase_1.default.getById(Alltimedata, Tabels_1.CDR_ANALYTICS_TABLE);
            return data;
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * Get analytics for a specific account code for all time.
     */
    static async getAllTimeAnalyticsByAccount(accountcode) {
        try {
            const data = await DataBase_1.default.getById(Alltimedata + accountcode, Tabels_1.CDR_ANALYTICS_TABLE);
            return data;
        }
        catch (error) {
            throw error;
        }
    }
    static aggregateAnalyticsRecords(analyticsArray) {
        if (!analyticsArray || analyticsArray.length === 0)
            return null;
        // Initialize aggregated record
        const aggregated = {
            total_calls: 0,
            answered_calls: 0,
            missed_calls: 0,
            failed_calls: 0,
            total_duration: 0,
            avg_duration: 0,
            busiest_hour: "",
            most_called_number: "",
            most_frequent_caller: "",
            accountcode: analyticsArray[0].accountcode,
            date: analyticsArray[0].date,
            id: analyticsArray[0].id,
        };
        // Temporary maps to track counts for busiest hour, most called number, and most frequent caller
        const busiestHourCount = {};
        const mostCalledNumberCount = {};
        const mostFrequentCallerCount = {};
        analyticsArray.forEach((record) => {
            aggregated.total_calls += record.total_calls;
            aggregated.answered_calls += record.answered_calls;
            aggregated.missed_calls += record.missed_calls;
            aggregated.failed_calls += record.failed_calls;
            aggregated.total_duration += record.total_duration;
            // Track busiest hour
            if (record.busiest_hour) {
                busiestHourCount[record.busiest_hour] = (busiestHourCount[record.busiest_hour] || 0) + 1;
            }
            // Track most called number
            if (record.most_called_number) {
                mostCalledNumberCount[record.most_called_number] = (mostCalledNumberCount[record.most_called_number] || 0) + 1;
            }
            // Track most frequent caller
            if (record.most_frequent_caller) {
                mostFrequentCallerCount[record.most_frequent_caller] = (mostFrequentCallerCount[record.most_frequent_caller] || 0) + 1;
            }
        });
        // Compute average call duration
        aggregated.avg_duration = aggregated.total_calls > 0 ? aggregated.total_duration / aggregated.total_calls : 0;
        aggregated.avg_duration = parseInt(aggregated.avg_duration.toFixed(2));
        // Determine the busiest hour
        aggregated.busiest_hour = Object.keys(busiestHourCount).reduce((a, b) => (busiestHourCount[a] > busiestHourCount[b] ? a : b), "");
        // Determine the most called number
        aggregated.most_called_number = Object.keys(mostCalledNumberCount).reduce((a, b) => (mostCalledNumberCount[a] > mostCalledNumberCount[b] ? a : b), "");
        // Determine the most frequent caller
        aggregated.most_frequent_caller = Object.keys(mostFrequentCallerCount).reduce((a, b) => (mostFrequentCallerCount[a] > mostFrequentCallerCount[b] ? a : b), "");
        return aggregated;
    }
    static async populateAnalyticsForYesterday() {
        try {
            // Get yesterday's date in YYYY-MM-DD format
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const formattedDate = yesterday.toISOString().split("T")[0];
            // Fetch all call records from the CDR log table for yesterday
            const logs = await DataBase_1.default.getAll(Tabels_1.CDR_LOGS_TABLE, "*", "", "WHERE DATE(start) = ?", [formattedDate]);
            if (!logs || logs.length === 0)
                return;
            // Aggregate data by accountcode
            const analyticsData = {};
            logs.forEach((log) => {
                const key = log.accountcode;
                if (!analyticsData[key]) {
                    analyticsData[key] = {
                        accountcode: log.accountcode,
                        date: formattedDate,
                        total_calls: 0,
                        answered_calls: 0,
                        missed_calls: 0,
                        failed_calls: 0,
                        total_duration: 0,
                        busiest_hour_map: {},
                        most_called_map: {},
                        most_frequent_caller_map: {},
                    };
                }
                const data = analyticsData[key];
                data.total_calls++;
                data.total_duration += parseInt(log.duration);
                if (log.disposition === "ANSWERED") {
                    data.answered_calls++;
                }
                else if (log.disposition === "NO ANSWER") {
                    data.missed_calls++;
                }
                else if (log.disposition === "FAILED" || log.disposition === "BUSY") {
                    data.failed_calls++;
                }
                // Track busiest hour
                const hour = log.start.split(" ")[1].split(":")[0]; // Extract hour (HH)
                data.busiest_hour_map[hour] = (data.busiest_hour_map[hour] || 0) + 1;
                // Track most called number
                data.most_called_map[log.dst] = (data.most_called_map[log.dst] || 0) + 1;
                // Track most frequent caller
                data.most_frequent_caller_map[log.src] = (data.most_frequent_caller_map[log.src] || 0) + 1;
            });
            // Process aggregated data and insert using `create` method
            for (const key in analyticsData) {
                const entry = analyticsData[key];
                entry.avg_duration = entry.answered_calls > 0 ? entry.total_duration / entry.answered_calls : 0;
                entry.busiest_hour = Object.keys(entry.busiest_hour_map).reduce((a, b) => (entry.busiest_hour_map[a] > entry.busiest_hour_map[b] ? a : b), "00");
                entry.most_called_number = Object.keys(entry.most_called_map).reduce((a, b) => (entry.most_called_map[a] > entry.most_called_map[b] ? a : b), "");
                entry.most_frequent_caller = Object.keys(entry.most_frequent_caller_map).reduce((a, b) => (entry.most_frequent_caller_map[a] > entry.most_frequent_caller_map[b] ? a : b), "");
                // Use existing create method
                await Analytics.create(entry.accountcode, entry.date, entry.total_calls, entry.answered_calls, entry.missed_calls, entry.failed_calls, entry.total_duration, entry.avg_duration, entry.busiest_hour, entry.most_called_number, entry.most_frequent_caller);
                await this.saveAlltimeData({
                    id: Alltimedata + entry.accountcode,
                    accountcode: entry.accountcode,
                    date: entry.date,
                    total_calls: entry.total_calls,
                    answered_calls: entry.answered_calls,
                    missed_calls: entry.missed_calls,
                    failed_calls: entry.failed_calls,
                    total_duration: entry.total_duration,
                    avg_duration: entry.avg_duration,
                    busiest_hour: entry.busiest_hour,
                    most_called_number: entry.most_called_number,
                    most_frequent_caller: entry.most_frequent_caller,
                });
                await this.saveAlltimeData({
                    id: Alltimedata,
                    accountcode: Alltimedata,
                    date: entry.date,
                    total_calls: entry.total_calls,
                    answered_calls: entry.answered_calls,
                    missed_calls: entry.missed_calls,
                    failed_calls: entry.failed_calls,
                    total_duration: entry.total_duration,
                    avg_duration: entry.avg_duration,
                    busiest_hour: entry.busiest_hour,
                    most_called_number: entry.most_called_number,
                    most_frequent_caller: entry.most_frequent_caller,
                });
            }
        }
        catch (error) {
            throw error;
        }
    }
}
exports.default = Analytics;
// (method) Database.getAll<Analytics>(table: string, customSelect?: string, join?: string, where?: string, whereParams?: any[]): Promise<Analytics[]>
