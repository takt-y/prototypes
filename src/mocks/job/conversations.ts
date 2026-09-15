import type { Conversation } from '../../types/job'

export const conversations: Conversation[] = [
  {
    id: 'conv1',
    personId: 'p1',
    messages: [
      { id: 'msg1', from: 'me', text: 'Hi Elena! I saw you work at Booking.com, I just applied for the Frontend Engineer Intern role.', time: '2026-08-20T14:02:00' },
      { id: 'msg2', from: 'them', text: 'Hey! Nice, I can put in a good word with the hiring manager if you want.', time: '2026-08-20T14:15:00' },
      { id: 'msg3', from: 'me', text: 'That would be amazing, thank you!', time: '2026-08-20T14:16:00' },
    ],
  },
  {
    id: 'conv2',
    personId: 'p7',
    messages: [
      { id: 'msg4', from: 'me', text: 'Hi Marco, are you still enjoying it at Mollie?', time: '2026-08-22T09:30:00' },
      { id: 'msg5', from: 'them', text: 'Yes, really good team. Are you interviewing there?', time: '2026-08-22T09:41:00' },
      { id: 'msg6', from: 'me', text: 'Just got invited for a second interview, quite nervous.', time: '2026-09-09T18:05:00' },
    ],
  },
]
