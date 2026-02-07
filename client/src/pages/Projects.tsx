import { useNavigate, useParams, useLocation } from "react-router-dom"
import type { Project } from "../types"
import { useEffect, useState } from "react"
import { Loader2Icon, Monitor, Smartphone, Tablet, Save, ExternalLink, MoreVertical } from "lucide-react"
import { dummyConversations, dummyProjects } from "../assets/assets"

const Projects = () => {
  const { projectId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [device, setDevice] = useState<'phone' | 'tablet' | 'desktop'>("desktop")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [chatInput, setChatInput] = useState("")

  const fetchProject = async () => {
    if (projectId === 'new') {
      const prompt = (location.state as { prompt?: string })?.prompt || 'My website'
      setProject({
        id: 'new',
        name: prompt.slice(0, 50) + (prompt.length > 50 ? '...' : ''),
        initial_prompt: prompt,
        current_code: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: '',
        conversation: [],
        versions: [],
        current_version_index: '',
      })
      setLoading(false)
      setIsGenerating(true)
      return
    }
    const found = dummyProjects.find(p => p.id === projectId)
    setTimeout(() => {
      if (found) {
        setProject({ ...found, conversation: dummyConversations })
        setIsGenerating(!found.current_code)
      }
      setLoading(false)
    }, 1500)
  }

  useEffect(() => {
    fetchProject()
  }, [projectId])

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => setIsSaving(false), 1000)
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim() || !project) return
    // Placeholder: backend will handle AI response
    setChatInput("")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <Loader2Icon className="size-7 animate-spin text-violet-200" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white gap-4">
        <p className="text-2xl font-medium text-gray-200">Project not found</p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700"
        >
          Go home
        </button>
      </div>
    )
  }

  const deviceWidth = device === 'phone' ? 'max-w-[375px]' : device === 'tablet' ? 'max-w-[768px]' : 'max-w-full'

  return (
    <div className="flex flex-col h-screen w-full bg-gray-900 text-white">
      {/* Builder navbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 border-b border-gray-800 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <img
            src="/favicon.svg"
            alt="logo"
            className="h-6 cursor-pointer shrink-0"
            onClick={() => navigate("/")}
          />
          <p className="text-xs text-gray-400 truncate max-w-[180px]">
            Previewing last saved version
          </p>
        </div>

        <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-0.5">
          <button
            onClick={() => setDevice("desktop")}
            className={`p-2 rounded-md transition ${device === 'desktop' ? 'bg-indigo-600' : 'hover:bg-gray-700'}`}
            title="Desktop"
          >
            <Monitor size={18} />
          </button>
          <button
            onClick={() => setDevice("tablet")}
            className={`p-2 rounded-md transition ${device === 'tablet' ? 'bg-indigo-600' : 'hover:bg-gray-700'}`}
            title="Tablet"
          >
            <Tablet size={18} />
          </button>
          <button
            onClick={() => setDevice("phone")}
            className={`p-2 rounded-md transition ${device === 'phone' ? 'bg-indigo-600' : 'hover:bg-gray-700'}`}
            title="Phone"
          >
            <Smartphone size={18} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-gray-700 hover:bg-gray-600 disabled:opacity-70 text-sm"
          >
            {isSaving ? <Loader2Icon className="size-4 animate-spin" /> : <Save size={16} />}
            Save
          </button>
          <a
            href={`/preview/${project.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gray-700 hover:bg-gray-600 text-sm"
          >
            <ExternalLink size={16} />
            Preview
          </a>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-md hover:bg-gray-700"
          >
            <MoreVertical size={18} />
          </button>
        </div>
      </div>

      {/* Main: preview + chat */}
      <div className="flex flex-1 min-h-0">
        <div className={`flex-1 flex flex-col items-center justify-center p-4 bg-gray-950 overflow-auto ${device !== 'desktop' ? 'min-w-0' : ''}`}>
          <div className={`w-full ${deviceWidth} h-full min-h-[400px] rounded-lg overflow-hidden border border-gray-700 bg-white shadow-xl transition-all`}>
            {isGenerating ? (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-gray-500 bg-gray-900">
                <Loader2Icon className="size-8 animate-spin text-indigo-400" />
                <p>Generating your website...</p>
              </div>
            ) : project.current_code ? (
              <iframe
                title="Preview"
                srcDoc={project.current_code}
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-500 bg-gray-900 p-4 text-center">
                <p>No preview yet.</p>
                <p className="text-sm">Use the chat to describe changes and generate your site.</p>
              </div>
            )}
          </div>
        </div>

        <div className="w-80 shrink-0 border-l border-gray-800 flex flex-col bg-gray-900/50 max-md:hidden">
          <div className="px-3 py-2 border-b border-gray-800">
            <h3 className="text-sm font-medium text-gray-300">Conversation</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3 no-scrollbar">
            {project.conversation?.length ? (
              project.conversation.map((msg) => (
                <div
                  key={msg.id}
                  className={`text-sm p-2 rounded-lg ${msg.role === 'user' ? 'bg-indigo-900/50 ml-4' : 'bg-gray-800 mr-4'}`}
                >
                  <p className="text-gray-200">{msg.content}</p>
                  <span className="text-xs text-gray-500">{msg.timestamp}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No messages yet. Ask for changes to your website.</p>
            )}
          </div>
          <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-800">
            <textarea
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Describe changes..."
              rows={2}
              className="w-full rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="mt-2 w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-sm font-medium"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Projects
