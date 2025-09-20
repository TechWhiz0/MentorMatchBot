import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  BookOpen,
  Users,
  MessageSquare,
  User,
  Bot,
  Calendar,
  TrendingUp,
  Target,
  Plus,
  FolderOpen,
  Trash2,
  Edit,
  Save,
  X,
  Bookmark,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useState, useEffect } from "react";
import { api, Project, Todo } from "@/lib/api";

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", description: "" });
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [newTodo, setNewTodo] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  // Fetch projects on component mount
  useEffect(() => {
    if (profile?.role === "mentee") {
      fetchProjects();
    }
  }, [profile?.role]);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const projectsData = await api.getProjects();
      setProjects(projectsData);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const dashboardItems = [
    {
      title: "Study Assistant",
      description: "Get help with your studies using AI",
      icon: Bot,
      href: "/chatbot",
      color: "bg-blue-500",
    },
    {
      title: "Browse Mentors",
      description: "Find mentors in your field of interest",
      icon: Users,
      href: "/browse",
      color: "bg-green-500",
    },
    {
      title: "My Profile",
      description: "View and edit your profile",
      icon: User,
      href: "/profile",
      color: "bg-purple-500",
    },
    {
      title: "Mentorship Requests",
      description: "Manage your mentorship requests",
      icon: MessageSquare,
      href:
        profile?.role === "mentor" ? "/mentor-dashboard" : "/mentee-dashboard",
      color: "bg-orange-500",
    },
    ...(profile?.role === "mentee"
      ? [
          {
            title: "My Links",
            description: "Save links with embedded previews",
            icon: Bookmark,
            href: "#",
            color: "bg-indigo-500",
            external: true,
          },
        ]
      : []),
  ];

  const addProject = async () => {
    if (newProject.name.trim() && newProject.description.trim()) {
      try {
        setIsLoading(true);
        const project = await api.createProject(
          newProject.name,
          newProject.description
        );
        setProjects([project, ...projects]);
        setNewProject({ name: "", description: "" });
        setShowAddProject(false);
      } catch (error) {
        console.error("Error creating project:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      await api.deleteProject(projectId);
      setProjects(projects.filter((p) => p.id !== projectId));
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const addTodo = async (projectId: string) => {
    const todoText = newTodo[projectId]?.trim();
    if (todoText) {
      try {
        const updatedProject = await api.addTodo(projectId, todoText);
        setProjects(
          projects.map((p) => (p.id === projectId ? updatedProject : p))
        );
        setNewTodo({ ...newTodo, [projectId]: "" });
      } catch (error) {
        console.error("Error adding todo:", error);
      }
    }
  };

  const toggleTodo = async (projectId: string, todoId: string) => {
    try {
      const project = projects.find((p) => p.id === projectId);
      if (project) {
        const todo = project.todos.find((t) => t.id === todoId);
        if (todo) {
          const updatedProject = await api.updateTodo(projectId, todoId, {
            completed: !todo.completed,
          });
          setProjects(
            projects.map((p) => (p.id === projectId ? updatedProject : p))
          );
        }
      }
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const deleteTodo = async (projectId: string, todoId: string) => {
    try {
      const updatedProject = await api.deleteTodo(projectId, todoId);
      setProjects(
        projects.map((p) => (p.id === projectId ? updatedProject : p))
      );
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const updateProject = async (
    projectId: string,
    updates: Partial<{ name: string; description: string; status: string }>
  ) => {
    try {
      const updatedProject = await api.updateProject(projectId, updates);
      setProjects(
        projects.map((p) => (p.id === projectId ? updatedProject : p))
      );
      setEditingProject(null);
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {profile?.name || user?.email?.split("@")[0] || "User"}!
        </h1>
        <p className="text-muted-foreground">
          Ready to continue your learning journey? Here's what you can do today.
        </p>
        {profile && (
          <Badge variant="secondary" className="mt-2">
            {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
          </Badge>
        )}
      </div>

      {/* Main Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dashboardItems.map((item, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${item.color}`}>
                  <item.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {item.description}
              </p>
              <Button asChild className="w-full">
                {item.external ? (
                  <a href={item.href} target="_blank" rel="noopener noreferrer">
                    Get Started
                  </a>
                ) : (
                  <Link to={item.href}>Get Started</Link>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Project Management Section - Only for Mentees */}
      {profile?.role === "mentee" && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">My Projects</h2>
              <p className="text-muted-foreground">
                Manage your learning projects and track your progress
              </p>
            </div>
            <Button
              onClick={() => setShowAddProject(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Project
            </Button>
          </div>

          {/* Add Project Modal */}
          {showAddProject && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Add New Project</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Project Name</label>
                  <Input
                    placeholder="Enter project name"
                    value={newProject.name}
                    onChange={(e) =>
                      setNewProject({ ...newProject, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="Describe your project"
                    value={newProject.description}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={addProject}
                    disabled={isLoading}
                    className="flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Saving...
                      </>
                    ) : (
                      "Save Project"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddProject(false);
                      setNewProject({ name: "", description: "" });
                    }}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <FolderOpen className="h-5 w-5 text-blue-500" />
                      <div>
                        {editingProject === project.id ? (
                          <Input
                            value={project.name}
                            onChange={(e) =>
                              updateProject(project.id, {
                                name: e.target.value,
                              })
                            }
                            className="h-8 text-sm font-semibold"
                          />
                        ) : (
                          <h3 className="font-semibold">{project.name}</h3>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setEditingProject(
                            editingProject === project.id ? null : project.id
                          )
                        }
                      >
                        {editingProject === project.id ? (
                          <Save className="h-4 w-4" />
                        ) : (
                          <Edit className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteProject(project.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                  {editingProject === project.id ? (
                    <Textarea
                      value={project.description}
                      onChange={(e) =>
                        updateProject(project.id, {
                          description: e.target.value,
                        })
                      }
                      className="text-sm"
                      rows={2}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {project.description}
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Goals</h4>
                      <Badge variant="secondary">
                        {project.todos.length} tasks
                      </Badge>
                    </div>

                    {/* Todo List */}
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {project.todos.map((todo) => (
                        <div key={todo.id} className="flex items-center gap-2">
                          <Checkbox
                            checked={todo.completed}
                            onCheckedChange={() =>
                              toggleTodo(project.id, todo.id)
                            }
                          />
                          <span
                            className={`text-sm flex-1 ${
                              todo.completed
                                ? "line-through text-muted-foreground"
                                : ""
                            }`}
                          >
                            {todo.text}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteTodo(project.id, todo.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    {/* Add Todo */}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a task..."
                        value={newTodo[project.id] || ""}
                        onChange={(e) =>
                          setNewTodo({
                            ...newTodo,
                            [project.id]: e.target.value,
                          })
                        }
                        onKeyPress={(e) =>
                          e.key === "Enter" && addTodo(project.id)
                        }
                        className="flex-1"
                      />
                      <Button
                        size="sm"
                        onClick={() => addTodo(project.id)}
                        disabled={!newTodo[project.id]?.trim()}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Progress */}
                    {project.todos.length > 0 && (
                      <div className="pt-2">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Progress</span>
                          <span>
                            {project.todos.filter((t) => t.completed).length}/
                            {project.todos.length}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{
                              width: `${project.progress}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {projects.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No projects yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start by creating your first project to organize your learning
                  goals
                </p>
                <Button onClick={() => setShowAddProject(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Project
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
