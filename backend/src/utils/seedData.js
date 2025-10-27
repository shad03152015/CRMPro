require('dotenv').config();
const mongoose = require('mongoose');
const Pipeline = require('../models/Pipeline');
const Stage = require('../models/Stage');
const Contact = require('../models/Contact');
const Opportunity = require('../models/Opportunity');
const Calendar = require('../models/Calendar');
const Appointment = require('../models/Appointment');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
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
      Opportunity.deleteMany({}),
      Calendar.deleteMany({}),
      Appointment.deleteMany({}),
      Conversation.deleteMany({}),
      Message.deleteMany({})
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

    // Create calendars
    console.log('Creating sample calendars...');
    const calendars = await Calendar.insertMany([
      {
        name: 'Sales Calendar',
        description: 'Calendar for sales team meetings and demos',
        color: '#2196f3',
        timezone: 'America/New_York',
        isActive: true,
        defaultDuration: 30,
        settings: {
          allowBooking: true,
          requireApproval: false,
          bufferTime: 5,
          maxAdvanceBooking: 30,
          minAdvanceBooking: 1
        }
      },
      {
        name: 'Support Calendar',
        description: 'Customer support and consultation calendar',
        color: '#4caf50',
        timezone: 'America/New_York',
        isActive: true,
        defaultDuration: 45,
        settings: {
          allowBooking: true,
          requireApproval: true,
          bufferTime: 10,
          maxAdvanceBooking: 14,
          minAdvanceBooking: 1
        }
      }
    ]);

    // Create appointments
    console.log('Creating sample appointments...');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    nextWeek.setHours(14, 0, 0, 0);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(15, 0, 0, 0);

    const appointments = await Appointment.insertMany([
      {
        calendarId: calendars[0]._id,
        title: 'Product Demo - Acme Corp',
        description: 'Enterprise package demonstration for Acme Corporation',
        startTime: tomorrow,
        endTime: new Date(tomorrow.getTime() + 60 * 60 * 1000), // 1 hour
        location: 'Zoom Meeting',
        locationType: 'video',
        meetingLink: 'https://zoom.us/j/123456789',
        contactId: contacts[0]._id,
        opportunityId: opportunities[0]._id,
        status: 'scheduled',
        attendees: [
          { email: 'john.doe@acmecorp.com', name: 'John Doe', status: 'accepted' }
        ],
        reminders: [
          { type: 'email', minutesBefore: 15 }
        ]
      },
      {
        calendarId: calendars[0]._id,
        title: 'Follow-up Call - TechStart',
        description: 'Discussion about cloud migration proposal',
        startTime: new Date(tomorrow.getTime() + 3 * 60 * 60 * 1000), // 3 hours after first
        endTime: new Date(tomorrow.getTime() + 3.5 * 60 * 60 * 1000), // 30 min
        location: 'Phone Call',
        locationType: 'phone',
        contactId: contacts[1]._id,
        opportunityId: opportunities[1]._id,
        status: 'confirmed',
        attendees: [
          { email: 'jane.smith@techstart.com', name: 'Jane Smith', status: 'accepted' }
        ],
        reminders: [
          { type: 'email', minutesBefore: 30 }
        ]
      },
      {
        calendarId: calendars[0]._id,
        title: 'Contract Review - Innovate Solutions',
        description: 'Final contract review and signing',
        startTime: nextWeek,
        endTime: new Date(nextWeek.getTime() + 60 * 60 * 1000), // 1 hour
        location: '123 Business Park, Suite 500',
        locationType: 'physical',
        contactId: contacts[2]._id,
        opportunityId: opportunities[2]._id,
        status: 'scheduled',
        attendees: [
          { email: 'm.johnson@innovate.com', name: 'Michael Johnson', status: 'pending' }
        ],
        reminders: [
          { type: 'email', minutesBefore: 60 },
          { type: 'notification', minutesBefore: 15 }
        ]
      },
      {
        calendarId: calendars[1]._id,
        title: 'Support Session - Global Tech',
        description: 'Technical support and troubleshooting',
        startTime: new Date(tomorrow.getTime() + 5 * 60 * 60 * 1000),
        endTime: new Date(tomorrow.getTime() + 5.75 * 60 * 60 * 1000), // 45 min
        location: 'Google Meet',
        locationType: 'video',
        meetingLink: 'https://meet.google.com/abc-defg-hij',
        contactId: contacts[4]._id,
        status: 'confirmed',
        attendees: [
          { email: 'david.w@globaltech.com', name: 'David Wilson', status: 'accepted' }
        ]
      },
      {
        calendarId: calendars[0]._id,
        title: 'Discovery Call - Digital World',
        description: 'Initial consultation completed',
        startTime: yesterday,
        endTime: new Date(yesterday.getTime() + 45 * 60 * 1000), // 45 min
        location: 'Phone Call',
        locationType: 'phone',
        contactId: contacts[3]._id,
        status: 'completed',
        notes: 'Good call - interested in marketing automation platform',
        attendees: [
          { email: 'emily.b@digitalworld.com', name: 'Emily Brown', status: 'accepted' }
        ]
      }
    ]);

    // Create conversations
    console.log('Creating sample conversations...');
    const conversations = [];

    // Active conversation with Acme Corp
    const conversation1 = await Conversation.create({
      contactId: contacts[0]._id,
      subject: 'Enterprise Package Implementation Questions',
      status: 'open',
      channel: 'email',
      lastMessageAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      lastMessagePreview: 'Thank you for the quick response. I have a few more questions about the implementation timeline...',
      unreadCount: 2,
      isStarred: true,
      tags: ['important', 'implementation']
    });
    conversations.push(conversation1);

    // Messages for conversation1
    await Message.insertMany([
      {
        conversationId: conversation1._id,
        sender: {
          type: 'contact',
          name: 'John Doe',
          email: 'john.doe@acmecorp.com'
        },
        content: 'Hi, we received your proposal for the Enterprise Package. Could you provide more details about the implementation timeline?',
        direction: 'inbound',
        status: 'read',
        channel: 'email',
        sentAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        readAt: new Date(Date.now() - 23 * 60 * 60 * 1000)
      },
      {
        conversationId: conversation1._id,
        sender: {
          type: 'user',
          name: 'Sales Team',
          email: 'sales@crmpro.com'
        },
        content: 'Hello John, thank you for your interest! The typical implementation timeline is 6-8 weeks, which includes setup, data migration, training, and testing phases. We can discuss a customized timeline based on your specific needs.',
        direction: 'outbound',
        status: 'read',
        channel: 'email',
        sentAt: new Date(Date.now() - 20 * 60 * 60 * 1000), // 20 hours ago
        readAt: new Date(Date.now() - 18 * 60 * 60 * 1000)
      },
      {
        conversationId: conversation1._id,
        sender: {
          type: 'contact',
          name: 'John Doe',
          email: 'john.doe@acmecorp.com'
        },
        content: 'Thank you for the quick response. I have a few more questions about the implementation timeline and resource requirements. Can we schedule a call this week?',
        direction: 'inbound',
        status: 'sent',
        channel: 'email',
        sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      }
    ]);

    // Conversation with TechStart
    const conversation2 = await Conversation.create({
      contactId: contacts[1]._id,
      subject: 'Cloud Migration Proposal - Follow-up',
      status: 'open',
      channel: 'email',
      lastMessageAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      lastMessagePreview: 'We reviewed your proposal and are very impressed. Our team would like to move forward with Phase 1...',
      unreadCount: 1,
      isStarred: true,
      tags: ['hot-lead']
    });
    conversations.push(conversation2);

    await Message.insertMany([
      {
        conversationId: conversation2._id,
        sender: {
          type: 'user',
          name: 'Sales Team',
          email: 'sales@crmpro.com'
        },
        content: 'Hi Jane, following up on our call last week. Attached is the detailed proposal for your cloud migration project. Please let me know if you have any questions.',
        direction: 'outbound',
        status: 'read',
        channel: 'email',
        sentAt: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
        readAt: new Date(Date.now() - 46 * 60 * 60 * 1000),
        attachments: [
          {
            filename: 'Cloud_Migration_Proposal.pdf',
            url: 'https://example.com/proposals/cloud-migration.pdf',
            size: 2456789,
            mimeType: 'application/pdf'
          }
        ]
      },
      {
        conversationId: conversation2._id,
        sender: {
          type: 'contact',
          name: 'Jane Smith',
          email: 'jane.smith@techstart.com'
        },
        content: 'We reviewed your proposal and are very impressed. Our team would like to move forward with Phase 1. Can we schedule a kickoff meeting?',
        direction: 'inbound',
        status: 'sent',
        channel: 'email',
        sentAt: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 hours ago
      }
    ]);

    // Chat conversation with Digital World
    const conversation3 = await Conversation.create({
      contactId: contacts[3]._id,
      subject: 'Marketing Automation Platform Questions',
      status: 'open',
      channel: 'chat',
      lastMessageAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      lastMessagePreview: 'Perfect! I\'ll bring those questions to our team meeting tomorrow.',
      unreadCount: 0,
      isStarred: false,
      tags: ['chat', 'inquiry']
    });
    conversations.push(conversation3);

    await Message.insertMany([
      {
        conversationId: conversation3._id,
        sender: {
          type: 'contact',
          name: 'Emily Brown',
          email: 'emily.b@digitalworld.com'
        },
        content: 'Hi! I have some questions about your marketing automation platform.',
        direction: 'inbound',
        status: 'read',
        channel: 'chat',
        sentAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
        readAt: new Date(Date.now() - 59 * 60 * 1000)
      },
      {
        conversationId: conversation3._id,
        sender: {
          type: 'user',
          name: 'Support Team',
          email: 'support@crmpro.com'
        },
        content: 'Hello Emily! I\'d be happy to help. What would you like to know?',
        direction: 'outbound',
        status: 'read',
        channel: 'chat',
        sentAt: new Date(Date.now() - 58 * 60 * 1000),
        readAt: new Date(Date.now() - 55 * 60 * 1000)
      },
      {
        conversationId: conversation3._id,
        sender: {
          type: 'contact',
          name: 'Emily Brown',
          email: 'emily.b@digitalworld.com'
        },
        content: 'We\'re looking for a solution that can handle email campaigns, social media scheduling, and lead scoring. Does your platform support all of these?',
        direction: 'inbound',
        status: 'read',
        channel: 'chat',
        sentAt: new Date(Date.now() - 50 * 60 * 1000),
        readAt: new Date(Date.now() - 48 * 60 * 1000)
      },
      {
        conversationId: conversation3._id,
        sender: {
          type: 'user',
          name: 'Support Team',
          email: 'support@crmpro.com'
        },
        content: 'Yes, absolutely! Our platform includes all those features and more. I can send you some documentation and case studies that show how other companies are using these features.',
        direction: 'outbound',
        status: 'read',
        channel: 'chat',
        sentAt: new Date(Date.now() - 45 * 60 * 1000),
        readAt: new Date(Date.now() - 40 * 60 * 1000)
      },
      {
        conversationId: conversation3._id,
        sender: {
          type: 'contact',
          name: 'Emily Brown',
          email: 'emily.b@digitalworld.com'
        },
        content: 'Perfect! I\'ll bring those questions to our team meeting tomorrow.',
        direction: 'inbound',
        status: 'read',
        channel: 'chat',
        sentAt: new Date(Date.now() - 30 * 60 * 1000),
        readAt: new Date(Date.now() - 25 * 60 * 1000)
      }
    ]);

    // Closed conversation with Innovate Solutions
    const conversation4 = await Conversation.create({
      contactId: contacts[2]._id,
      subject: 'Consulting Services Contract - Signed',
      status: 'closed',
      channel: 'email',
      lastMessageAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      lastMessagePreview: 'Great! Looking forward to working with you. The contract has been signed and returned.',
      unreadCount: 0,
      isStarred: false,
      tags: ['closed', 'contract']
    });
    conversations.push(conversation4);

    await Message.insertMany([
      {
        conversationId: conversation4._id,
        sender: {
          type: 'user',
          name: 'Sales Team',
          email: 'sales@crmpro.com'
        },
        content: 'Hi Michael, the final contract for the 6-month consulting engagement is ready. Please review and sign at your earliest convenience.',
        direction: 'outbound',
        status: 'read',
        channel: 'email',
        sentAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        readAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
      },
      {
        conversationId: conversation4._id,
        sender: {
          type: 'contact',
          name: 'Michael Johnson',
          email: 'm.johnson@innovate.com'
        },
        content: 'Great! Looking forward to working with you. The contract has been signed and returned.',
        direction: 'inbound',
        status: 'read',
        channel: 'email',
        sentAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        readAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      }
    ]);

    // Phone conversation with Global Tech
    const conversation5 = await Conversation.create({
      contactId: contacts[4]._id,
      subject: 'Security Audit Discussion',
      status: 'pending',
      channel: 'phone',
      lastMessageAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      lastMessagePreview: 'Call completed - waiting for David to review our proposal and get back to us by Friday.',
      unreadCount: 0,
      isStarred: false,
      tags: ['follow-up']
    });
    conversations.push(conversation5);

    await Message.insertMany([
      {
        conversationId: conversation5._id,
        sender: {
          type: 'system',
          name: 'CRM System'
        },
        content: 'Phone call scheduled with David Wilson regarding Security Audit project.',
        direction: 'inbound',
        status: 'read',
        channel: 'phone',
        sentAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
      },
      {
        conversationId: conversation5._id,
        sender: {
          type: 'system',
          name: 'CRM System'
        },
        content: 'Call completed - waiting for David to review our proposal and get back to us by Friday.',
        direction: 'outbound',
        status: 'read',
        channel: 'phone',
        sentAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
        metadata: {
          duration: 1800, // 30 minutes
          recordingUrl: 'https://example.com/recordings/call-123.mp3'
        }
      }
    ]);

    const totalMessages = await Message.countDocuments({});

    console.log('\n✅ Database seeding completed successfully!');
    console.log(`\n📊 Seeded Data Summary:`);
    console.log(`   - Pipelines: 1`);
    console.log(`   - Stages: ${stages.length}`);
    console.log(`   - Contacts: ${contacts.length}`);
    console.log(`   - Opportunities: ${opportunities.length}`);
    console.log(`     • Open: ${opportunities.filter(o => o.status === 'open').length}`);
    console.log(`     • Won: ${opportunities.filter(o => o.status === 'won').length}`);
    console.log(`     • Lost: ${opportunities.filter(o => o.status === 'lost').length}`);
    console.log(`   - Calendars: ${calendars.length}`);
    console.log(`   - Appointments: ${appointments.length}`);
    console.log(`     • Scheduled: ${appointments.filter(a => a.status === 'scheduled').length}`);
    console.log(`     • Confirmed: ${appointments.filter(a => a.status === 'confirmed').length}`);
    console.log(`     • Completed: ${appointments.filter(a => a.status === 'completed').length}`);
    console.log(`   - Total Pipeline Value: $${opportunities.filter(o => o.status === 'open').reduce((sum, o) => sum + o.value, 0).toLocaleString()}\n`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
