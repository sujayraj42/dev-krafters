const test = require('node:test');
const assert = require('node:assert');
require('../bootstrap');
const { createJsonRequest } = require('../helpers/mock-request');

const { POST: leadsPost } = require('@/app/api/leads/route');

test('Tier 4: Journey 2 - E-Commerce Retailer Custom Quote & Lead Generation', async (t) => {
  await t.test('Retailer calculates custom e-commerce scope and saves quote to database vault', async () => {
    // 1. Math calculation for E-commerce package with 15 pages + AI Chatbot + Monthly Care
    const basePkgPrice = 75000;
    const defaultPages = 10;
    const configuredPages = 15;
    const extraPagesCost = (configuredPages - defaultPages) * 1500; // 5 * 1500 = 7500
    const chatbotAddonCost = 8000;
    const monthlyCareCost = 3000;

    const totalOneTime = basePkgPrice + extraPagesCost + chatbotAddonCost;
    assert.equal(totalOneTime, 90500);

    // 2. Format query string for Contact redirection
    const quoteHref = `/contact?package=store&pages=${configuredPages}&total=INR_${totalOneTime}`;
    const parsedQuoteUrl = new URL(`https://devkrafters.com${quoteHref}`);
    assert.equal(parsedQuoteUrl.searchParams.get('package'), 'store');
    assert.equal(parsedQuoteUrl.searchParams.get('pages'), '15');
    assert.equal(parsedQuoteUrl.searchParams.get('total'), 'INR_90500');

    // 3. User clicks "Save Quote for Later"
    const estimateLeadPayload = {
      type: 'estimate',
      name: 'Priya Sharma (Zari Sarees)',
      email: 'priya@zarisarees.com',
      phone: '+919876522222',
      projectType: 'E-commerce Store',
      pages: configuredPages,
      budget: '₹90,000 - ₹1,00,000',
      totalEstimateInr: totalOneTime,
      totalEstimateFormatted: `₹${totalOneTime.toLocaleString()} + ₹${monthlyCareCost.toLocaleString()}/mo`,
      message: 'Custom estimate saved: 15 pages with payment gateway, Razorpay, AI chatbot, and monthly care support.',
    };

    const saveRes = await leadsPost(createJsonRequest('/api/leads', estimateLeadPayload));
    assert.equal(saveRes.status, 200, 'Saving custom estimate should return 200');
    const saveData = await saveRes.json();
    assert.equal(saveData.success, true);
    assert.ok(saveData.lead, 'Lead record must be created');
    assert.equal(saveData.lead.type, 'estimate');
    assert.equal(saveData.lead.name, 'Priya Sharma (Zari Sarees)');
  });
});
