/**
 * exchane.js
 * @author Vivian
 * @version 1.0.0
 * copyright 2014-2017, gandxiaowei@gmail.com all rights reserved.
 */
"use strict";

const cheerio = require('cheerio');
const request = require('sync-request');
const moment = require('moment');

function get_exchange(date = Date.now()) {
    date = moment(date);
    while (is_holiday(date)) {
        date = date.subtract(1, 'days');
    }
    return get_exchange_usd(date);
}

function is_holiday(date = Date.now()) {
    let response = request('GET', `http://tool.bitefu.net/jiari/?d=${moment(date).format('YYYYMMDD')}`);
    return response.getBody('utf8') != '0';
}

function get_exchange_usd(date = Date.now()) {
    let response = request('POST', 'http://www.safe.gov.cn/AppStructured/view/project_RMBQuery.action', {
        body: `projectBean.startDate=${moment(date).format('YYYY-MM-DD')}&projectBean.endDate=${moment(date).format('YYYY-MM-DD')}&queryYN=true`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    const $ = cheerio.load(response.getBody('utf8'));
    return Number($('tr.first > td:nth-child(2)').text().match(/\d+.\d+/)) / 100;
}

module.exports = get_exchange;