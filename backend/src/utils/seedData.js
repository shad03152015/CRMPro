require('dotenv').config();
const mongoose = require('mongoose');
const Pipeline = require('../models/Pipeline');
const Stage = require('../models/Stage');
const Contact = require('../models/Contact');
const Opportunity = require('../models/Opportunity');
const connectDB = require('./database');

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Connect to database
    await connectDB();

    // Clear existing data
    console.log('Clearing existing data...');
    await Promise.all([
      Pipeline.deleteMany({}),
      Stage.deleteMany({}),
      Contact.deleteMany({}),
      Opportunity.deleteMany({})
    ]);

    // Create default pipeline
    console.log('Creating Sales Pipeline...');
    const salesPipeline = await Pipeline.create({
      name: 'Sales Pipeline',
      description: 'Standard sales process',
      isActive: true,
      color: '#2196f3'
    });

    // Create stages
    console.log('Creating stages...');
    const stages = await Stage.insertMany([
      {
        pipelineId: salesPipeline._id,
        name: 'Lead',
        order: 0,
        probability: 10,
        color: '#9e9e9e'
      },
      {
        pipelineId: salesPipeline._id,
        name: 'Qualified',
        order: 1,
        probability: 25,
        color: '#2196f3'
      },
      {
        pipelineId: salesPipeline._id,
        name: 'Proposal',
        order: 2,
        probability: 50,
        color: '#ff9800'
      },
      {
        pipelineId: salesPipeline._id,
        name: 'Negotiation',
        order: 3,
        probability: 75,
        color: '#9c27b0'
      },
      {
        pipelineId: salesPipeline._id,
        name: 'Closed Won',
        order: 4,
        probability: 100,
        isClosedWon: true,
        color: '#4caf50'
      },
      {
        pipelineId: salesPipeline._id,
        name: 'Closed Lost',
        order: 5,
        probability: 0,
        isClosedLost: true,
        color: '#f44336'
      }
    ]);

    // Create contacts
    console.log('Creating sample contacts...');
    const contacts = await Contact.insertMany([
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@acmecorp.com',
        phone: '+1-555-0101',
        company: 'Acme Corporation',
        jobTitle: 'CEO'
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@techstart.com',
        phone: '+1-555-0102',
        company: 'TechStart Inc',
        jobTitle: 'CTO'
      },
      {
        firstName: 'Michael',
        lastName: 'Johnson',
        email: 'm.johnson@innovate.com',
        phone: '+1-555-0103',
        company: 'Innovate Solutions',
        jobTitle: 'VP Sales'
      },
      {
        firstName: 'Emily',
        lastName: 'Brown',
        email: 'emily.b@digitalworld.com',
        phone: '+1-555-0104',
        company: 'Digital World',
        jobTitle: 'Marketing Director'
      },
      {
        firstName: 'David',
        lastName: 'Wilson',
        email: 'david.w@globaltech.com',
        phone: '+1-555-0105',
        company: 'Global Tech',
        jobTitle: 'COO'
      }
    ]);

    // Create opportunities
    console.log('Creating sample opportunities...');
    const opportunities = [];

    // Open opportunities across different stages
    opportunities.push(
      {
        title: 'Acme Corp - Enterprise Package',
        value: 150000,
        pipelineId: salesPipeline._id,
        stageId: stages[1]._id, // Qualified
        contactId: contacts[0]._id,
        status: 'open',
        probability: 25,
        expectedCloseDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
        description: 'Enterprise software package for 500+ users'
      },
      {
        title: 'TechStart - Cloud Migration',
        value: 85000,
        pipelineId: salesPipeline._id,
        stageId: stages[2]._id, // Proposal
        contactId: contacts[1]._id,
        status: 'open',
        probability: 50,
        expectedCloseDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days
        description: 'Complete cloud infrastructure migration'
      },
      {
        title: 'Innovate Solutions - Consulting Services',
        value: 45000,
        pipelineId: salesPipeline._id,
        stageId: stages[3]._id, // Negotiation
        contactId: contacts[2]._id,
        status: 'open',
        probability: 75,
        expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        description: '6-month consulting engagement'
      },
      {
        title: 'Digital World - Marketing Automation',
        value: 65000,
        pipelineId: salesPipeline._id,
        stageId: stages[0]._id, // Lead
        contactId: contacts[3]._id,
        status: 'open',
        probability: 10,
        expectedCloseDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
        description: 'Marketing automation platform implementation'
      },
      {
        title: 'Global Tech - Security Audit',
        value: 35000,
        pipelineId: salesPipeline._id,
        stageId: stages[1]._id, // Qualified
        contactId: contacts[4]._id,
        status: 'open',
        probability: 25,
        expectedCloseDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000), // 40 days
        description: 'Comprehensive security audit and compliance review'
      }
    );

    // Won opportunities
    opportunities.push(
      {
        title: 'Acme Corp - Initial Setup',
        value: 25000,
        pipelineId: salesPipeline._id,
        stageId: stages[4]._id, // Closed Won
        contactId: contacts[0]._id,
        status: 'won',
        probability: 100,
        expectedCloseDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        actualCloseDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        description: 'Initial platform setup and configuration'
      },
      {
        title: 'TechStart - Training Package',
        value: 18000,
        pipelineId: salesPipeline._id,
        stageId: stages[4]._id, // Closed Won
        contactId: contacts[1]._id,
        status: 'won',
        probability: 100,
        expectedCloseDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        actualCloseDate: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
        description: 'Staff training and onboarding'
      },
      {
        title: 'Innovate Solutions - Phase 1',
        value: 42000,
        pipelineId: salesPipeline._id,
        stageId: stages[4]._id, // Closed Won
        contactId: contacts[2]._id,
        status: 'won',
        probability: 100,
        expectedCloseDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
        actualCloseDate: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000),
        description: 'First phase of digital transformation'
      }
    );

    // Lost opportunities
    opportunities.push(
      {
        title: 'Digital World - Previous Proposal',
        value: 55000,
        pipelineId: salesPipeline._id,
        stageId: stages[5]._id, // Closed Lost
        contactId: contacts[3]._id,
        status: 'lost',
        probability: 0,
        expectedCloseDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        actualCloseDate: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
        description: 'Lost to competitor - price sensitivity'
      },
      {
        title: 'Global Tech - Infrastructure Upgrade',
        value: 95000,
        pipelineId: salesPipeline._id,
        stageId: stages[5]._id, // Closed Lost
        contactId: contacts[4]._id,
        status: 'lost',
        probability: 0,
        expectedCloseDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
        actualCloseDate: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000),
        description: 'Budget constraints - postponed indefinitely'
      }
    );

    await Opportunity.insertMany(opportunities);

    console.log('\n✅ Database seeding completed successfully!');
    console.log(`\n📊 Seeded Data Summary:`);
    console.log(`   - Pipelines: 1`);
    console.log(`   - Stages: ${stages.length}`);
    console.log(`   - Contacts: ${contacts.length}`);
    console.log(`   - Opportunities: ${opportunities.length}`);
    console.log(`     • Open: ${opportunities.filter(o => o.status === 'open').length}`);
    console.log(`     • Won: ${opportunities.filter(o => o.status === 'won').length}`);
    console.log(`     • Lost: ${opportunities.filter(o => o.status === 'lost').length}`);
    console.log(`   - Total Pipeline Value: $${opportunities.filter(o => o.status === 'open').reduce((sum, o) => sum + o.value, 0).toLocaleString()}\n`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
