export interface WorkflowNodeData {
  id: string;
  title: string;
  copy: string;
  kind: 'input' | 'process' | 'review' | 'output';
  area: string;
  step: string;
}

export interface WorkflowConnectionData {
  from: string;
  to: string;
  fromPort?: 'left' | 'right' | 'top' | 'bottom';
  toPort?: 'left' | 'right' | 'top' | 'bottom';
  compactFromPort?: 'left' | 'right' | 'top' | 'bottom';
  compactToPort?: 'left' | 'right' | 'top' | 'bottom';
  style?: 'solid' | 'dotted';
}

export interface WorkflowData {
  id: string;
  label: string;
  title: string;
  summary: string;
  nodes: WorkflowNodeData[];
  connections: WorkflowConnectionData[];
}

export const homeWorkflow: WorkflowData = {
  id: 'home-enquiry',
  label: 'Illustrative workflow',
  title: 'Enquiry assistant',
  summary: 'A focused concept for preparing useful replies while keeping approval with the team.',
  nodes: [
    { id: 'brand', title: 'Brand knowledge', copy: 'Guidelines, tone and approved assets', kind: 'input', area: '1 / 1', step: 'Input' },
    { id: 'context', title: 'Conversation context', copy: 'Relevant messages and customer details', kind: 'input', area: '1 / 3', step: 'Input' },
    { id: 'enquiry', title: 'New enquiry', copy: 'A customer asks a question', kind: 'process', area: '2 / 1', step: '01' },
    { id: 'assistant', title: 'AI assistant', copy: 'Drafts a response using approved context', kind: 'process', area: '2 / 2', step: '02' },
    { id: 'review', title: 'Human review', copy: 'Approve, revise or redirect', kind: 'review', area: '2 / 3', step: '03' },
    { id: 'send', title: 'Send reply', copy: 'Return the approved response', kind: 'output', area: '3 / 3', step: '04' },
    { id: 'notify', title: 'Notify team', copy: 'Update Slack or email', kind: 'output', area: '3 / 2', step: '05' },
  ],
  connections: [
    { from: 'brand', to: 'assistant', fromPort: 'bottom', toPort: 'top', style: 'dotted' },
    { from: 'context', to: 'assistant', fromPort: 'bottom', toPort: 'top', style: 'dotted' },
    { from: 'enquiry', to: 'assistant', fromPort: 'right', toPort: 'left' },
    { from: 'assistant', to: 'review', fromPort: 'right', toPort: 'left' },
    { from: 'review', to: 'send', fromPort: 'bottom', toPort: 'top' },
    { from: 'review', to: 'notify', fromPort: 'bottom', toPort: 'top' },
  ],
};

export const socialEnquiryWorkflow: WorkflowData = {
  id: 'social-enquiry',
  label: 'Illustrative workflow 01',
  title: 'Social enquiry',
  summary: 'A concept for moving an Instagram or WhatsApp question from first contact to an approved reply.',
  nodes: [
    { id: 'social-in', title: 'Instagram / WhatsApp', copy: 'A customer sends an enquiry', kind: 'input', area: '2 / 1', step: '01' },
    { id: 'classify', title: 'Classify', copy: 'Identify topic, urgency and intent', kind: 'process', area: '2 / 2', step: '02' },
    { id: 'approved-info', title: 'Approved brand info', copy: 'Use current offers, tone and FAQs', kind: 'input', area: '1 / 2', step: 'Context' },
    { id: 'draft', title: 'Draft', copy: 'Prepare a grounded response', kind: 'process', area: '2 / 3', step: '03' },
    { id: 'approval', title: 'Human approval', copy: 'Edit, approve or redirect', kind: 'review', area: '2 / 4', step: '04' },
    { id: 'reply', title: 'Reply', copy: 'Return the approved answer', kind: 'output', area: '2 / 5', step: '05' },
    { id: 'team', title: 'Notify team', copy: 'Send the context to Slack or email', kind: 'output', area: '3 / 4', step: '06' },
  ],
  connections: [
    { from: 'social-in', to: 'classify', fromPort: 'right', toPort: 'left' },
    { from: 'classify', to: 'draft', fromPort: 'right', toPort: 'left' },
    { from: 'approved-info', to: 'draft', fromPort: 'bottom', toPort: 'top', style: 'dotted' },
    { from: 'draft', to: 'approval', fromPort: 'right', toPort: 'left', compactFromPort: 'bottom', compactToPort: 'top' },
    { from: 'approval', to: 'reply', fromPort: 'right', toPort: 'left' },
    { from: 'approval', to: 'team', fromPort: 'bottom', toPort: 'top' },
  ],
};

export const propertyLeadWorkflow: WorkflowData = {
  id: 'property-lead',
  label: 'Concept workflow 02',
  title: 'Property lead',
  summary: 'A structured route from a property question to a considered follow-up.',
  nodes: [
    { id: 'property-in', title: 'Property enquiry', copy: 'Receive interest from a prospective buyer', kind: 'input', area: '1 / 1', step: '01' },
    { id: 'requirements', title: 'Budget + location', copy: 'Gather the practical requirements', kind: 'process', area: '2 / 1', step: '02' },
    { id: 'listings', title: 'Available listings', copy: 'Reference the current approved inventory', kind: 'input', area: '3 / 1', step: '03' },
    { id: 'options', title: 'Suitable options', copy: 'Prepare a relevant shortlist', kind: 'process', area: '4 / 1', step: '04' },
    { id: 'property-review', title: 'Human review', copy: 'Check fit, availability and positioning', kind: 'review', area: '5 / 1', step: '05' },
    { id: 'follow-up', title: 'Follow-up', copy: 'Send the approved next step', kind: 'output', area: '6 / 1', step: '06' },
  ],
  connections: [
    { from: 'property-in', to: 'requirements' }, { from: 'requirements', to: 'listings' },
    { from: 'listings', to: 'options' }, { from: 'options', to: 'property-review' },
    { from: 'property-review', to: 'follow-up' },
  ],
};

export const contentApprovalWorkflow: WorkflowData = {
  id: 'content-approval',
  label: 'Concept workflow 03',
  title: 'Content approval',
  summary: 'A simple approval path for adapting one brief across several channels.',
  nodes: [
    { id: 'brief', title: 'Creative brief', copy: 'Define the message, audience and constraints', kind: 'input', area: '1 / 1', step: '01' },
    { id: 'variations', title: 'Channel variations', copy: 'Prepare relevant versions for each channel', kind: 'process', area: '2 / 1', step: '02' },
    { id: 'creative-review', title: 'Human creative review', copy: 'Refine language, visuals and cultural fit', kind: 'review', area: '3 / 1', step: '03' },
    { id: 'assets', title: 'Approve assets', copy: 'Confirm the final set', kind: 'review', area: '4 / 1', step: '04' },
    { id: 'schedule', title: 'Schedule', copy: 'Move approved work into the content calendar', kind: 'output', area: '5 / 1', step: '05' },
  ],
  connections: [
    { from: 'brief', to: 'variations' }, { from: 'variations', to: 'creative-review' },
    { from: 'creative-review', to: 'assets' }, { from: 'assets', to: 'schedule' },
  ],
};
