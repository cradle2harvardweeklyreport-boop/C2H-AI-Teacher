
import React from 'react';
import { type Tool, type Approach, type ChatSession } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';

interface SidebarProps {
  tools: Tool[];
  approaches: Approach[];
  selectedTool: Tool;
  onSelectTool: (tool: Tool) => void;
  selectedApproach: Approach;
  onSelectApproach: (approach: Approach) => void;
  chatSessions: ChatSession[];
  activeChatSessionId: string | null;
  onNewChat: () => void;
  onSwitchChat: (sessionId: string) => void;
  onDeleteChat: (sessionId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  tools,
  approaches,
  selectedTool,
  onSelectTool,
  selectedApproach,
  onSelectApproach,
  chatSessions,
  activeChatSessionId,
  onNewChat,
  onSwitchChat,
  onDeleteChat,
}) => {

  const handleToolClick = (tool: Tool) => {
    onSelectTool(tool);
    if (tool.id === 'chat' && chatSessions.length === 0) {
        onNewChat();
    }
  };

  return (
    <aside className="w-full md:w-80 bg-gray-50 border-r border-gray-200 p-4 sm:p-6 flex flex-col">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Tools</h2>
      <div className="space-y-2">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => handleToolClick(tool)}
            className={`w-full text-left px-4 py-2.5 rounded-lg transition-colors text-sm font-medium flex flex-col ${
              selectedTool.id === tool.id ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span>{tool.name}</span>
            <span className={`text-xs ${selectedTool.id === tool.id ? 'text-blue-600' : 'text-gray-500'}`}>{tool.description}</span>
          </button>
        ))}
      </div>

      {selectedTool.id === 'chat' ? (
        <div className="mt-8 flex-1 flex flex-col min-h-0">
          <div className="flex justify-between items-center mb-4">
             <h2 className="text-lg font-semibold text-gray-800">Chat History</h2>
             <button onClick={onNewChat} className="p-1 text-gray-500 hover:text-blue-600">
                <PlusIcon className="h-5 w-5"/>
             </button>
          </div>
          <div className="flex-1 overflow-y-auto -mr-4 pr-4">
            {chatSessions.length > 0 ? (
                <div className="space-y-2">
                {chatSessions.map(session => (
                    <div key={session.id} className="group flex items-center">
                        <button
                            onClick={() => onSwitchChat(session.id)}
                            className={`w-full text-left px-4 py-2 rounded-md text-sm truncate ${ activeChatSessionId === session.id ? 'bg-gray-200 text-gray-800 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            {session.title}
                        </button>
                        <button onClick={() => onDeleteChat(session.id)} className="ml-2 p-1 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            <TrashIcon className="h-4 w-4" />
                        </button>
                    </div>
                ))}
                </div>
            ) : (
                <p className="text-sm text-gray-500 text-center mt-4">No chat history. Start a new conversation!</p>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Approach</h2>
          <select
            value={selectedApproach.id}
            onChange={(e) => {
              const newApproach = approaches.find(a => a.id === e.target.value);
              if (newApproach) onSelectApproach(newApproach);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            {approaches.map((approach) => (
              <option key={approach.id} value={approach.id}>
                {approach.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
