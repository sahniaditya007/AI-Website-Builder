import { useNavigate, useParams } from "react-router-dom"
import type { Project } from "../types"
import { useEffect, useState } from "react"
import { Loader2Icon, Monitor, Smartphone, Tablet, Save, ExternalLink, MoreVertical } from "lucide-react"
import api from "@/config/axios"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"

const Projects = () => {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const { data: session, isPending } = authClient.useSession()

  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [device, setDevice] = useState<"phone" | "tablet" | "desktop">("desktop")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [chatInput, setChatInput] = useState("")

  const fetchProject = async () => {
    if (!projectId) return
    try {
      const { data } = await api.get(`/api/user/project/${projectId}`)
      setProject(data.project)
      setIsGenerating(data.project?.current_code ? false : true)
      setLoading(false)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message)
      console.log(error)
    }
  }

  const handleTogglePublish = async () => {
    if (!projectId) return
    try {
      const { data } = await api.get(`/api/user/publish-toggle/${projectId}`)
      toast.success(data.message)
      // Refetch project to update isPublished flag
      await fetchProject()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message)
      console.log(error)
    }
  }

  useEffect(() => {
    if (session?.user) {
      fetchProject()
    } else if (!isPending && !session?.user) {
      navigate("/")
      toast("Please login to view your projects")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user, isPending])

  useEffect(() => {
    if (project && !project.current_code) {
      const intervalId = setInterval(fetchProject, 10000)
      return () => clearInterval(intervalId)
    }
  }, [project])

  const handleSave = async () => {
    if (!projectId || !project?.current_code) return
    try {
      setIsSaving(true)
      await api.put(`/api/project/save/${projectId}`, {
        code: project.current_code,
      })
      toast.success("Project saved")
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message)
      console.log(error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim() || !projectId) return

    try {
      setIsGenerating(true)
      const message = chatInput.trim()
      setChatInput("")
      await api.post(`/api/project/revision/${projectId}`, { message })
      toast.success("Revision requested. Updating preview...")
      await fetchProject()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message)
      console.log(error)
    } finally {
      setIsGenerating(false)
    }
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

  const deviceWidth = device === "phone" ? "max-w-[375px]" : device === "tablet" ? "max-w-[768px]" : "max-w-full"

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
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md hover:bg-gray-700"
            >
              <MoreVertical size={18} />
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10">
                <button
                  onClick={handleTogglePublish}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-700"
                >
                  {project.isPublished ? "Unpublish" : "Publish"}
                </button>
              </div>
            )}
          </div>
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
