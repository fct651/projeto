'use client'

import { useState, useEffect } from 'react'
import { 
  MapPin, 
  CheckCircle, 
  MessageSquare, 
  Users, 
  Download, 
  Trash2, 
  Settings,
  ArrowLeft,
  Send,
  Eye,
  EyeOff,
  Star,
  Clock,
  User
} from 'lucide-react'
import * as XLSX from 'xlsx'

// Dados das 24 salas da feira
const SALAS_DATA = [
  {
    id: 1,
    nome: "Robótica Avançada",
    categoria: "Tecnologia",
    descricao: "Explore o mundo da robótica com demonstrações de robôs autônomos, braços mecânicos e inteligência artificial aplicada. Veja como a tecnologia está revolucionando a indústria e o dia a dia.",
    professor: "Prof. Carlos Silva",
    nivel: "Intermediário"
  },
  {
    id: 2,
    nome: "Química Experimental",
    categoria: "Ciências",
    descricao: "Experimentos fascinantes com reações químicas coloridas, cristalização e análise de substâncias. Descubra os segredos da química através de demonstrações práticas e seguras.",
    professor: "Profa. Ana Santos",
    nivel: "Básico"
  },
  {
    id: 3,
    nome: "Astronomia e Cosmos",
    categoria: "Ciências",
    descricao: "Uma jornada pelo universo com telescópios, planetário portátil e modelos do sistema solar. Explore galáxias distantes e aprenda sobre a origem do universo.",
    professor: "Prof. João Oliveira",
    nivel: "Intermediário"
  },
  {
    id: 4,
    nome: "Biotecnologia Moderna",
    categoria: "Ciências",
    descricao: "Descubra como a biotecnologia está transformando a medicina, agricultura e meio ambiente. Veja culturas de células, DNA e técnicas de engenharia genética.",
    professor: "Profa. Maria Costa",
    nivel: "Avançado"
  },
  {
    id: 5,
    nome: "Realidade Virtual",
    categoria: "Tecnologia",
    descricao: "Experimente mundos virtuais imersivos, jogos educativos em VR e simulações científicas. Veja como a realidade virtual está mudando a educação e entretenimento.",
    professor: "Prof. Pedro Lima",
    nivel: "Básico"
  },
  {
    id: 6,
    nome: "Energia Renovável",
    categoria: "Sustentabilidade",
    descricao: "Painéis solares, turbinas eólicas em miniatura e células de combustível. Aprenda sobre fontes de energia limpa e sustentável para o futuro do planeta.",
    professor: "Profa. Laura Mendes",
    nivel: "Intermediário"
  },
  {
    id: 7,
    nome: "Inteligência Artificial",
    categoria: "Tecnologia",
    descricao: "Demonstrações de machine learning, reconhecimento de imagens e chatbots inteligentes. Veja como a IA está presente no nosso cotidiano e suas aplicações futuras.",
    professor: "Prof. Ricardo Alves",
    nivel: "Avançado"
  },
  {
    id: 8,
    nome: "Física Quântica",
    categoria: "Ciências",
    descricao: "Experimentos com luz, ondas e partículas subatômicas. Explore os mistérios da física quântica através de demonstrações visuais e interativas.",
    professor: "Prof. Fernando Rocha",
    nivel: "Avançado"
  },
  {
    id: 9,
    nome: "Ecologia Urbana",
    categoria: "Sustentabilidade",
    descricao: "Jardins verticais, compostagem e sistemas de purificação de água. Aprenda como criar ambientes sustentáveis em áreas urbanas.",
    professor: "Profa. Camila Ferreira",
    nivel: "Básico"
  },
  {
    id: 10,
    nome: "Programação e Games",
    categoria: "Tecnologia",
    descricao: "Criação de jogos, aplicativos móveis e websites. Veja como a programação pode ser divertida e criativa, com demonstrações de projetos estudantis.",
    professor: "Prof. Gabriel Torres",
    nivel: "Intermediário"
  },
  {
    id: 11,
    nome: "Medicina do Futuro",
    categoria: "Ciências",
    descricao: "Simuladores médicos, impressão 3D de órgãos e telemedicina. Descubra como a tecnologia está revolucionando os cuidados com a saúde.",
    professor: "Dra. Patricia Nunes",
    nivel: "Avançado"
  },
  {
    id: 12,
    nome: "Arqueologia Digital",
    categoria: "História",
    descricao: "Reconstruções 3D de sítios arqueológicos, análise de artefatos e técnicas de datação. Veja como a tecnologia ajuda a desvendar o passado.",
    professor: "Prof. Marcos Dias",
    nivel: "Intermediário"
  },
  {
    id: 13,
    nome: "Matemática Aplicada",
    categoria: "Matemática",
    descricao: "Fractais, geometria espacial e modelagem matemática. Descubra a beleza da matemática através de visualizações e aplicações práticas.",
    professor: "Profa. Juliana Campos",
    nivel: "Intermediário"
  },
  {
    id: 14,
    nome: "Nanotecnologia",
    categoria: "Tecnologia",
    descricao: "Materiais inteligentes, nanopartículas e aplicações médicas. Explore o mundo invisível da nanotecnologia e suas aplicações revolucionárias.",
    professor: "Prof. André Barbosa",
    nivel: "Avançado"
  },
  {
    id: 15,
    nome: "Psicologia Cognitiva",
    categoria: "Ciências Humanas",
    descricao: "Experimentos sobre percepção, memória e tomada de decisões. Entenda como funciona a mente humana através de testes interativos.",
    professor: "Profa. Beatriz Lopes",
    nivel: "Básico"
  },
  {
    id: 16,
    nome: "Engenharia Aeroespacial",
    categoria: "Engenharia",
    descricao: "Foguetes em miniatura, simuladores de voo e modelos de satélites. Explore os desafios da exploração espacial e aviação.",
    professor: "Prof. Rodrigo Martins",
    nivel: "Avançado"
  },
  {
    id: 17,
    nome: "Arte e Tecnologia",
    categoria: "Arte",
    descricao: "Arte digital, hologramas e instalações interativas. Veja como a tecnologia está transformando a expressão artística contemporânea.",
    professor: "Profa. Sofia Reis",
    nivel: "Básico"
  },
  {
    id: 18,
    nome: "Genética e Evolução",
    categoria: "Ciências",
    descricao: "Modelos de DNA, árvores evolutivas e experimentos com plantas. Compreenda os mecanismos da hereditariedade e evolução das espécies.",
    professor: "Prof. Lucas Cardoso",
    nivel: "Intermediário"
  },
  {
    id: 19,
    nome: "Cidades Inteligentes",
    categoria: "Urbanismo",
    descricao: "Sensores IoT, sistemas de trânsito inteligente e gestão urbana. Veja como a tecnologia pode tornar as cidades mais eficientes e sustentáveis.",
    professor: "Profa. Helena Souza",
    nivel: "Intermediário"
  },
  {
    id: 20,
    nome: "Oceanografia",
    categoria: "Ciências",
    descricao: "Aquários marinhos, simuladores de correntes oceânicas e vida marinha. Explore os mistérios dos oceanos e sua importância para o planeta.",
    professor: "Prof. Diego Pereira",
    nivel: "Básico"
  },
  {
    id: 21,
    nome: "Neurociência",
    categoria: "Ciências",
    descricao: "Modelos do cérebro, eletroencefalografia e experimentos sobre cognição. Descubra como funciona o órgão mais complexo do corpo humano.",
    professor: "Dra. Carla Moreira",
    nivel: "Avançado"
  },
  {
    id: 22,
    nome: "Agricultura 4.0",
    categoria: "Sustentabilidade",
    descricao: "Hidroponia, sensores de solo e drones agrícolas. Veja como a tecnologia está revolucionando a produção de alimentos de forma sustentável.",
    professor: "Prof. Thiago Ramos",
    nivel: "Intermediário"
  },
  {
    id: 23,
    nome: "Criptografia e Segurança",
    categoria: "Tecnologia",
    descricao: "Códigos secretos, blockchain e proteção de dados. Aprenda sobre segurança digital e como proteger informações no mundo conectado.",
    professor: "Prof. Vinicius Castro",
    nivel: "Avançado"
  },
  {
    id: 24,
    nome: "Mudanças Climáticas",
    categoria: "Sustentabilidade",
    descricao: "Simuladores climáticos, análise de dados ambientais e soluções sustentáveis. Compreenda os desafios climáticos e as possíveis soluções.",
    professor: "Profa. Renata Silva",
    nivel: "Intermediário"
  }
]

interface Comment {
  id: string
  salaId: number
  autor: string
  texto: string
  timestamp: number
  rating: number
}

interface VisitedRoom {
  salaId: number
  timestamp: number
}

export default function FeiraCienciaTecnologia() {
  const [currentView, setCurrentView] = useState<'home' | 'sala' | 'admin'>('home')
  const [selectedSala, setSelectedSala] = useState<number | null>(null)
  const [visitedRooms, setVisitedRooms] = useState<VisitedRoom[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newRating, setNewRating] = useState(5)
  const [adminPassword, setAdminPassword] = useState('')
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [filterCategory, setFilterCategory] = useState<string>('all')

  // Carregar dados do localStorage
  useEffect(() => {
    const savedVisitedRooms = localStorage.getItem('visitedRooms')
    const savedComments = localStorage.getItem('comments')
    
    if (savedVisitedRooms) {
      setVisitedRooms(JSON.parse(savedVisitedRooms))
    }
    
    if (savedComments) {
      setComments(JSON.parse(savedComments))
    }
  }, [])

  // Salvar dados no localStorage
  useEffect(() => {
    localStorage.setItem('visitedRooms', JSON.stringify(visitedRooms))
  }, [visitedRooms])

  useEffect(() => {
    localStorage.setItem('comments', JSON.stringify(comments))
  }, [comments])

  const markRoomAsVisited = (salaId: number) => {
    if (!visitedRooms.find(room => room.salaId === salaId)) {
      setVisitedRooms([...visitedRooms, { salaId, timestamp: Date.now() }])
    }
  }

  const addComment = () => {
    if (newComment.trim() && newAuthor.trim() && selectedSala) {
      const comment: Comment = {
        id: Date.now().toString(),
        salaId: selectedSala,
        autor: newAuthor.trim(),
        texto: newComment.trim(),
        timestamp: Date.now(),
        rating: newRating
      }
      setComments([...comments, comment])
      setNewComment('')
      setNewAuthor('')
      setNewRating(5)
    }
  }

  const deleteComment = (commentId: string) => {
    setComments(comments.filter(c => c.id !== commentId))
  }

  const exportToExcel = () => {
    // Dados das salas visitadas
    const visitedData = visitedRooms.map(room => {
      const sala = SALAS_DATA.find(s => s.id === room.salaId)
      return {
        'ID da Sala': room.salaId,
        'Nome da Sala': sala?.nome || 'Desconhecida',
        'Categoria': sala?.categoria || 'N/A',
        'Professor': sala?.professor || 'N/A',
        'Data da Visita': new Date(room.timestamp).toLocaleString('pt-BR')
      }
    })

    // Dados dos comentários
    const commentsData = comments.map(comment => {
      const sala = SALAS_DATA.find(s => s.id === comment.salaId)
      return {
        'ID do Comentário': comment.id,
        'ID da Sala': comment.salaId,
        'Nome da Sala': sala?.nome || 'Desconhecida',
        'Autor': comment.autor,
        'Comentário': comment.texto,
        'Avaliação': comment.rating,
        'Data': new Date(comment.timestamp).toLocaleString('pt-BR')
      }
    })

    // Estatísticas gerais
    const statsData = [
      { 'Métrica': 'Total de Salas', 'Valor': SALAS_DATA.length },
      { 'Métrica': 'Salas Visitadas', 'Valor': visitedRooms.length },
      { 'Métrica': 'Total de Comentários', 'Valor': comments.length },
      { 'Métrica': 'Avaliação Média', 'Valor': comments.length > 0 ? (comments.reduce((acc, c) => acc + c.rating, 0) / comments.length).toFixed(1) : 'N/A' }
    ]

    // Criar workbook
    const wb = XLSX.utils.book_new()
    
    // Adicionar planilhas
    const wsVisited = XLSX.utils.json_to_sheet(visitedData)
    const wsComments = XLSX.utils.json_to_sheet(commentsData)
    const wsStats = XLSX.utils.json_to_sheet(statsData)
    
    XLSX.utils.book_append_sheet(wb, wsVisited, 'Salas Visitadas')
    XLSX.utils.book_append_sheet(wb, wsComments, 'Comentários')
    XLSX.utils.book_append_sheet(wb, wsStats, 'Estatísticas')
    
    // Salvar arquivo
    XLSX.writeFile(wb, `feira-ciencia-dados-${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  const authenticateAdmin = () => {
    if (adminPassword === 'admin123') {
      setIsAdminAuthenticated(true)
      setAdminPassword('')
    } else {
      alert('Senha incorreta!')
    }
  }

  const categories = ['all', ...Array.from(new Set(SALAS_DATA.map(sala => sala.categoria)))]
  const filteredSalas = filterCategory === 'all' 
    ? SALAS_DATA 
    : SALAS_DATA.filter(sala => sala.categoria === filterCategory)

  const getSalaComments = (salaId: number) => {
    return comments.filter(c => c.salaId === salaId)
  }

  const getAverageRating = (salaId: number) => {
    const salaComments = getSalaComments(salaId)
    if (salaComments.length === 0) return 0
    return salaComments.reduce((acc, c) => acc + c.rating, 0) / salaComments.length
  }

  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case 'Básico': return 'bg-green-100 text-green-800'
      case 'Intermediário': return 'bg-yellow-100 text-yellow-800'
      case 'Avançado': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (categoria: string) => {
    const colors: { [key: string]: string } = {
      'Tecnologia': 'bg-blue-100 text-blue-800',
      'Ciências': 'bg-purple-100 text-purple-800',
      'Sustentabilidade': 'bg-green-100 text-green-800',
      'História': 'bg-orange-100 text-orange-800',
      'Matemática': 'bg-indigo-100 text-indigo-800',
      'Ciências Humanas': 'bg-pink-100 text-pink-800',
      'Engenharia': 'bg-gray-100 text-gray-800',
      'Arte': 'bg-rose-100 text-rose-800',
      'Urbanismo': 'bg-teal-100 text-teal-800'
    }
    return colors[categoria] || 'bg-gray-100 text-gray-800'
  }

  if (currentView === 'admin') {
    if (!isAdminAuthenticated) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 mt-20">
              <div className="text-center mb-8">
                <Settings className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900">Área Administrativa</h1>
                <p className="text-gray-600 mt-2">Digite a senha para acessar</p>
              </div>
              
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Senha de administrador"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && authenticateAdmin()}
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                <button
                  onClick={authenticateAdmin}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  Entrar
                </button>
                
                <button
                  onClick={() => setCurrentView('home')}
                  className="w-full text-gray-600 py-2 hover:text-gray-800 transition-colors"
                >
                  Voltar ao início
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Painel Administrativo</h1>
                <p className="text-gray-600">Gerencie comentários e exporte dados da feira</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={exportToExcel}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Exportar Excel
                </button>
                <button
                  onClick={() => {
                    setCurrentView('home')
                    setIsAdminAuthenticated(false)
                  }}
                  className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Sair
                </button>
              </div>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total de Salas</p>
                  <p className="text-3xl font-bold text-gray-900">{SALAS_DATA.length}</p>
                </div>
                <MapPin className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Salas Visitadas</p>
                  <p className="text-3xl font-bold text-gray-900">{visitedRooms.length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Comentários</p>
                  <p className="text-3xl font-bold text-gray-900">{comments.length}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Avaliação Média</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {comments.length > 0 ? (comments.reduce((acc, c) => acc + c.rating, 0) / comments.length).toFixed(1) : '0.0'}
                  </p>
                </div>
                <Star className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </div>

          {/* Lista de Comentários */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Gerenciar Comentários</h2>
            
            {comments.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Nenhum comentário encontrado</p>
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => {
                  const sala = SALAS_DATA.find(s => s.id === comment.salaId)
                  return (
                    <div key={comment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900">{sala?.nome}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(sala?.categoria || '')}`}>
                              {sala?.categoria}
                            </span>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${i < comment.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-700 mb-2">{comment.texto}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {comment.autor}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {new Date(comment.timestamp).toLocaleString('pt-BR')}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteComment(comment.id)}
                          className="flex items-center gap-2 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                          Deletar
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (currentView === 'sala' && selectedSala) {
    const sala = SALAS_DATA.find(s => s.id === selectedSala)
    const salaComments = getSalaComments(selectedSala)
    const averageRating = getAverageRating(selectedSala)
    const isVisited = visitedRooms.some(room => room.salaId === selectedSala)

    if (!sala) return null

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setCurrentView('home')}
                  className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Voltar
                </button>
                <div className="flex items-center gap-2">
                  {isVisited && <CheckCircle className="w-6 h-6 text-green-300" />}
                  <span className="text-sm">Sala {sala.id}</span>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold mb-2">{sala.nome}</h1>
              <p className="text-white/90 mb-4">{sala.professor}</p>
              
              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white`}>
                  {sala.categoria}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white`}>
                  {sala.nivel}
                </span>
                {averageRating > 0 && (
                  <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                    <Star className="w-4 h-4 text-yellow-300 fill-current" />
                    <span className="text-sm font-medium">{averageRating.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Conteúdo */}
            <div className="p-6">
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Sobre esta sala</h2>
                <p className="text-gray-700 leading-relaxed">{sala.descricao}</p>
              </div>

              {/* Botão de marcar como visitada */}
              {!isVisited && (
                <div className="mb-8">
                  <button
                    onClick={() => markRoomAsVisited(selectedSala)}
                    className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Marcar como Visitada
                  </button>
                </div>
              )}

              {/* Seção de Comentários */}
              <div className="border-t pt-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Comentários ({salaComments.length})
                </h2>

                {/* Formulário para novo comentário */}
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="font-medium text-gray-900 mb-4">Deixe seu comentário</h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      placeholder="Seu nome"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Avaliação
                      </label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            onClick={() => setNewRating(rating)}
                            className="p-1"
                          >
                            <Star
                              className={`w-6 h-6 ${rating <= newRating ? 'text-yellow-400 fill-current' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Escreva seu comentário sobre esta sala..."
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    />
                    
                    <button
                      onClick={addComment}
                      disabled={!newComment.trim() || !newAuthor.trim()}
                      className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="w-4 h-4" />
                      Enviar Comentário
                    </button>
                  </div>
                </div>

                {/* Lista de comentários */}
                <div className="space-y-4">
                  {salaComments.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">Seja o primeiro a comentar sobre esta sala!</p>
                    </div>
                  ) : (
                    salaComments.map((comment) => (
                      <div key={comment.id} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{comment.autor}</span>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${i < comment.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(comment.timestamp).toLocaleString('pt-BR')}
                          </span>
                        </div>
                        <p className="text-gray-700">{comment.texto}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Feira de Ciência e Tecnologia
              </h1>
              <p className="text-gray-600">
                Explore {SALAS_DATA.length} salas incríveis • {visitedRooms.length} visitadas • {comments.length} comentários
              </p>
            </div>
            <button
              onClick={() => setCurrentView('admin')}
              className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors"
            >
              <Settings className="w-4 h-4" />
              Admin
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Filtros */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilterCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterCategory === category
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {category === 'all' ? 'Todas as Categorias' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de Salas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSalas.map((sala) => {
            const isVisited = visitedRooms.some(room => room.salaId === sala.id)
            const salaComments = getSalaComments(sala.id)
            const averageRating = getAverageRating(sala.id)

            return (
              <div
                key={sala.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                onClick={() => {
                  setSelectedSala(sala.id)
                  setCurrentView('sala')
                }}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-2 py-1 rounded-full">
                        Sala {sala.id}
                      </span>
                      {isVisited && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                    <MapPin className="w-5 h-5 text-gray-400" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">{sala.nome}</h3>
                  <p className="text-gray-600 text-sm mb-3">{sala.professor}</p>
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">{sala.descricao}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(sala.categoria)}`}>
                      {sala.categoria}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getNivelColor(sala.nivel)}`}>
                      {sala.nivel}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{salaComments.length}</span>
                      </div>
                      {averageRating > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span>{averageRating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-indigo-600 font-medium text-sm">
                      Explorar →
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {filteredSalas.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Nenhuma sala encontrada nesta categoria</p>
          </div>
        )}
      </div>
    </div>
  )
}