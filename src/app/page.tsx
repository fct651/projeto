'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'
import {
  MapPin,
  CheckCircle,
  MessageSquare,
  Download,
  Trash2,
  Settings,
  ArrowLeft,
  Send,
  Eye,
  EyeOff,
  Star,
  Clock,
  User as UserIcon
} from 'lucide-react'
import * as XLSX from 'xlsx'

// Inicializa o Supabase no escopo do módulo (uma única vez no cliente)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Tipos
interface Sala {
  id: number
  nome: string
  categoria: string
  descricao: string
  professor: string
  nivel: string
}

interface SalaComment {
  id: string | number
  sala_id: number
  autor: string
  texto: string
  created_at: string
  rating: number
}

interface VisitedRoom {
  salaId: number
  timestamp: number
}

// Dados das 24 salas da feira
const SALAS_DATA: Sala[] = [
  {
    id: 1,
    nome: '1º A - Africanidades e Oficina de Argila',
    categoria: 'Pílula ERER - Educação para as Relações Etnico-raciais',
    descricao:
      'Africanidades e Oficina de Argila celebra a cultura e herança africana por meio de produções artísticas feitas pelas crianças, valorizando a identidade, a ancestralidade e a expressão criativa.',
    professor: 'Profa. Vera',
    nivel: 'manhã'
  },
  {
    id: 2,
    nome: '1º B - Brinquedos Antigos e Brinquedos Tecnológicos',
    categoria: 'Ciência, Tecnologia e Inovação',
    descricao:
      'Brinquedos Antigos e Brinquedos Tecnológicos apresenta a evolução das formas de brincar ao longo do tempo, destacando as transformações culturais e tecnológicas nas infâncias de diferentes gerações.',
    professor: 'Profa. Shirley',
    nivel: 'manhã'
  },
  {
    id: 3,
    nome: '1º C - Brinquedos e Jogos Recicláveis',
    categoria: 'Inovação, Sustentabilidade e Meio Ambiente',
    descricao:
      'Brinquedos e Jogos Recicláveis estimula a criatividade e a consciência ambiental das crianças, mostrando como materiais reaproveitados podem se transformar em divertidas formas de brincar e aprender.',
    professor: 'Profa. Luciana',
    nivel: 'tarde'
  },
  {
    id: 4,
    nome: '1º D - As Contribuições Africanas para Nossa Cultura',
    categoria: 'Pílula ERER - Educação para as Relações Etnico-raciais',
    descricao:
      'As Contribuições Africanas para Nossa Cultura reconhece e valoriza a influência africana na formação da identidade brasileira, presente na música, na culinária, na linguagem e em diversas expressões culturais.',
    professor: 'Profa. Sheila',
    nivel: 'tarde'
  },
  {
    id: 5,
    nome: '2ºA - Natureza Medicinal, Experimento com Abacate e Feijão e Arte com Componentes da Natureza',
    categoria: 'Saúde e Bem-Estar',
    descricao:
      'Natureza Medicinal, Experimento com Abacate e Feijão e Arte com Componentes da Natureza une ciência e criatividade ao mostrar o poder das plantas na saúde, o ciclo de vida vegetal e a beleza artística presente nos elementos naturais.',
    professor: 'Profa. Josélia',
    nivel: 'manhã'
  },
  {
    id: 6,
    nome: '2º B - Terrário e Ilusão de Ótica',
    categoria: 'Inovação, Sustentabilidade e Meio Ambiente',
    descricao:
      'Terrário apresenta pequenos ecossistemas, demonstrando o equilíbrio da natureza e a importância da preservação ambiental. Ilusão de Ótica explora o olhar humano pelas formas e cores, unindo arte e ciência em experiências visuais surpreendentes.',
    professor: 'Profa. Débora',
    nivel: 'manhã'
  },
  {
    id: 7,
    nome: '2º C - O Cultivo de Plantas e Seus Benefícios para a Saúde',
    categoria: 'Saúde e Bem-Estar',
    descricao:
      'O Cultivo de Plantas e Seus Benefícios para a Saúde destaca a importância das plantas para o bem-estar físico e mental, incentivando hábitos sustentáveis e o contato com a natureza.',
    professor: 'Profa. Monique',
    nivel: 'tarde'
  },
  {
    id: 8,
    nome: '2º D - Germinação de Alpiste',
    categoria: 'Inovação, Sustentabilidade e Meio Ambiente',
    descricao:
      'Germinação de Alpiste apresenta o processo de crescimento das plantas, promovendo a observação científica e a compreensão dos ciclos da natureza.',
    professor: 'Profa. Adriana',
    nivel: 'tarde'
  },
  {
    id: 9,
    nome: '3º A - A Evolução dos Meios de Comunicação',
    categoria: 'Ciência, Tecnologia e Inovação',
    descricao:
    'A Evolução dos Meios de Comunicação mostra como as formas de transmitir informações se transformaram ao longo do tempo, conectando o passado e o presente da tecnologia e da comunicação humana.',
    professor: 'Profa. Denise',
    nivel: 'manhã'
  },
  {
    id: 10,
    nome: '3º B - A Evolução dos Meios de Comunicação',
    categoria: 'Ciência, Tecnologia e Inovação',
    descricao:
      'A Evolução dos Meios de Comunicação mostra como as formas de transmitir informações se transformaram ao longo do tempo, conectando o passado e o presente da tecnologia e da comunicação humana.',
    professor: 'Profa. Jussara',
    nivel: 'manhã'
  },
  {
    id: 11,
    nome: '3º C - Brinquedos Antigos e Brinquedos Tecnológicos',
    categoria: 'Ciência, Tecnologia e Inovação',
    descricao:
      'Brinquedos Antigos e Brinquedos Tecnológicos apresenta a evolução das formas de brincar ao longo do tempo, destacando as transformações culturais e tecnológicas nas infâncias de diferentes gerações.',
    professor: 'Profa. Edyr',
    nivel: 'tarde'
  },
  {
    id: 12,
    nome: '3º D - Brinquedos Antigos e Brinquedos Tecnológicos',
    categoria: 'Ciência, Tecnologia e Inovação',
    descricao:
      'Brinquedos Antigos e Brinquedos Tecnológicos apresenta a evolução das formas de brincar ao longo do tempo, destacando as transformações culturais e tecnológicas nas infâncias de diferentes gerações.',
    professor: 'Profa. Shirley',
    nivel: 'tarde'
  },
  {
    id: 13,
    nome: '4º A - Engenhocas com Material Reciclável',
    categoria: 'Inovação, Sustentabilidade e Meio Ambiente',
    descricao:
      'Engenhocas com Material Reciclável estimula a criatividade e a sustentabilidade, mostrando invenções feitas pelas crianças e suas famílias a partir do reaproveitamento de materiais do cotidiano.',
    professor: 'Professores Anderson e Solange',
    nivel: 'manhã'
  },
  {
    id: 14,
    nome: '4º B - Brinquedos Folclóricos',
    categoria: 'Cultura e Diversidade',
    descricao:
      'Brinquedos Folclóricos resgata as tradições e a cultura popular brasileira, valorizando brincadeiras que fazem parte da infância e da identidade do nosso povo.',
    professor: 'Profa. Fabiana',
    nivel: 'manhã'
  },
  {
    id: 15,
    nome: '4º C - Libras e Experimentos Científicos',
    categoria: 'Acessibilidade, Comunicação e Inovação',
    descricao:
      'Libras promove a inclusão e o respeito à diversidade, apresentando a língua brasileira de sinais como forma de comunicação e expressão cultural.Já a mostra de Experimentos Científico desperta a curiosidade e o pensamento investigativo das crianças por meio de descobertas práticas e divertidas.',
    professor: 'Profa. Solange',
    nivel: 'tarde'
  },
  {
    id: 16,
    nome: '4º D - Experimentos Científicos Reversíveis e Irreversíveis',
    categoria: 'Ciência, Tecnologia e Inovação',
    descricao:
      'Experimentos Científicos Reversíveis e Irreversíveis demonstra, de forma prática e divertida, as transformações da matéria, destacando quais processos podem ou não ser revertidos.',
    professor: 'Profa. Lucia Helena',
    nivel: 'tarde'
  },
  {
    id: 17,
    nome: '5º A - Podcast Marie Curie',
    categoria: 'Ciência, Tecnologia e Inovação',
    descricao:
      'A exposição apresenta a vida e as descobertas de Marie Curie, pioneira na pesquisa sobre radioatividade e inspiração para gerações de cientistas, por meio de Podcast.',
    professor: 'Profa. Norma',
    nivel: 'manhã'
  },
  {
    id: 18,
    nome: '5º B - Podcast Marie Curie',
    categoria: 'Ciência, Tecnologia e Inovação',
    descricao:
      'A exposição apresenta a vida e as descobertas de Marie Curie, pioneira na pesquisa sobre radioatividade e inspiração para gerações de cientistas, por meio de Podcast.',
    professor: 'Prof. Ana Priscila',
    nivel: 'manhã'
  },
  {
    id: 19,
    nome: '5º C - Sistema Digestório, Experiências Científicas',
    categoria: 'Corpo Humano, Tecnologia e Inovação',
    descricao:
      'Uma viagem pelo corpo humano com o Sistema Digestório, curiosas Experiências Científicas e a arte do Cordel unindo ciência e cultura popular.',
    professor: 'Profa. Cíntia',
    nivel: 'tarde'
  },
  {
    id: 20,
    nome: '5º D - Sistema Respiratório, Eletricidade Estática',
    categoria: 'Corpo Humano, Tecnologia e Inovação',
    descricao:
      'Explorando o ar que nos dá vida e a energia invisível das cargas: Sistema Respiratório e Eletricidade Estática em ação!',
    professor: 'Profa. Vanessa',
    nivel: 'tarde'
  },
  {
    id: 21,
    nome: 'Inglês',
    categoria: 'Língua Estrangeira',
    descricao:
      'Descobrindo novos mundos através das palavras: a importância da Língua Inglesa na comunicação e na cultura global.',
    professor: 'profa. Ane Chelly, prof. Flávio,  profa. Luciana, profa. Nuncciella',
    nivel: 'manhã e tarde'
  },
  {
    id: 22,
    nome: 'Arte',
    categoria: 'Expressões Artísticas',
    descricao:
      'A Arte como expressão da criatividade humana, revelando emoções, ideias e diferentes formas de ver o mundo.',
    professor: ' Prof Emerson, profa Jéssica, profa Melissa, profa Rosana',
    nivel: 'manhã e tarde'
  },
  {
    id: 23,
    nome: 'Jardins I e II - Corredor Sonoro, Alimentação Saúdável e Elementos da Natureza',
    categoria: 'Educação Infantil',
    descricao:
      'Um convite para ouvir, sentir e aprender: sons da vida no Corredor Sonoro, cores da Alimentação Saudável e a harmonia dos Elementos da Natureza.',
    professor: 'Profa Ana Paula, profa Andréia,  profa Michele e profa Nathália',
    nivel: 'manhã e tarde'
  },
  {
    id: 24,
    nome: 'Educação Integral - Convivência e Afeto',
    categoria: 'Pílula ERER - Educação para as Relações Etnico-raciais',
    descricao:
      'Celebrando as Africanidades: raízes, cultura e saberes que enriquecem nossa história e identidade.',
    professor: 'Profa. Cristiana',
    nivel: 'manhã e tarde'
  },
  {
    id: 25,
    nome: 'Atendimento Educacional Especializado - AEE',
    categoria: 'Acessibilidade, Comunicação e Inovação',
    descricao:
      'A Sala Sensorial do Atendimento Educacional Especializado oferece experiências que estimulam os sentidos, favorecem a aprendizagem e promovem a inclusão de todas as crianças.',
    professor: 'Profa. Andréia e profa Patrícia',
    nivel: 'manhã'
  },
  {
    id: 26,
    nome: 'Robótica Educacional',
    categoria: 'Ciência, Tecnologia e Inovação',
    descricao:
      'Na Robótica Educacional, a imaginação ganha vida: cada peça, um passo rumo ao futuro!',
    professor: 'Profa. Maria',
    nivel: 'manhã e tarde'
  }
]

export default function FeiraCienciaTecnologia() {
  const [currentView, setCurrentView] = useState<'home' | 'sala' | 'admin'>('home')
  const [selectedSala, setSelectedSala] = useState<number | null>(null)
  const [visitedRooms, setVisitedRooms] = useState<VisitedRoom[]>([])
  const [comments, setComments] = useState<SalaComment[]>([])
  const [newComment, setNewComment] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newRating, setNewRating] = useState(5)
  const [adminPassword, setAdminPassword] = useState('')
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [loading, setLoading] = useState(false)

  const loadComments = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setComments((data || []) as SalaComment[])
    } catch (error) {
      console.error('Erro ao carregar comentários:', error)
    }
  }, [])

  // Carregar comentários e salas visitadas do localStorage na montagem
  useEffect(() => {
    loadComments()
    const savedVisitedRooms = localStorage.getItem('visitedRooms')
    if (savedVisitedRooms) {
      setVisitedRooms(JSON.parse(savedVisitedRooms))
    }
  }, [loadComments])

  // Salvar salas visitadas no localStorage
  useEffect(() => {
    localStorage.setItem('visitedRooms', JSON.stringify(visitedRooms))
  }, [visitedRooms])

  const markRoomAsVisited = (salaId: number) => {
    if (!visitedRooms.find((room) => room.salaId === salaId)) {
      setVisitedRooms([...visitedRooms, { salaId, timestamp: Date.now() }])
    }
  }

  const addComment = async () => {
    if (newComment.trim() && newAuthor.trim() && selectedSala) {
      setLoading(true)
      try {
        const { error } = await supabase.from('comments').insert([
          {
            sala_id: selectedSala,
            autor: newAuthor.trim(),
            texto: newComment.trim(),
            rating: newRating
          }
        ])

        if (error) throw error

        await loadComments()
        setNewComment('')
        setNewAuthor('')
        setNewRating(5)
      } catch (error) {
        console.error('Erro ao adicionar comentário:', error)
        alert('Erro ao adicionar comentário. Tente novamente.')
      } finally {
        setLoading(false)
      }
    }
  }

  const deleteComment = async (commentId: string | number) => {
    if (confirm('Tem certeza que deseja deletar este comentário?')) {
      try {
        const { error } = await supabase.from('comments').delete().eq('id', commentId)
        if (error) throw error
        await loadComments()
      } catch (error) {
        console.error('Erro ao deletar comentário:', error)
        alert('Erro ao deletar comentário.')
      }
    }
  }

  const exportToExcel = () => {
    const visitedData = visitedRooms.map((room) => {
      const sala = SALAS_DATA.find((s) => s.id === room.salaId)
      return {
        'ID da Exposição': room.salaId,
        'Nome da Exposição': sala?.nome || 'Desconhecida',
        Categoria: sala?.categoria || 'N/A',
        Professor: sala?.professor || 'N/A',
        'Data da Visita': new Date(room.timestamp).toLocaleString('pt-BR')
      }
    })

    const commentsData = comments.map((comment) => {
      const sala = SALAS_DATA.find((s) => s.id === comment.sala_id)
      return {
        'ID do Comentário': comment.id,
        'ID da Exposição': comment.sala_id,
        'Nome da Exposição': sala?.nome || 'Desconhecida',
        Autor: comment.autor,
        Comentário: comment.texto,
        Avaliação: comment.rating,
        Data: new Date(comment.created_at).toLocaleString('pt-BR')
      }
    })

    const statsData = [
      { Métrica: 'Total de Exposições', Valor: SALAS_DATA.length },
      { Métrica: 'Exposições Visitadas', Valor: visitedRooms.length },
      { Métrica: 'Total de Comentários', Valor: comments.length },
      {
        Métrica: 'Avaliação Média',
        Valor:
          comments.length > 0
            ? (comments.reduce((acc, c) => acc + c.rating, 0) / comments.length).toFixed(1)
            : 'N/A'
      }
    ]

    const wb = XLSX.utils.book_new()
    const wsVisited = XLSX.utils.json_to_sheet(visitedData)
    const wsComments = XLSX.utils.json_to_sheet(commentsData)
    const wsStats = XLSX.utils.json_to_sheet(statsData)

    XLSX.utils.book_append_sheet(wb, wsVisited, 'Exposições Visitadas')
    XLSX.utils.book_append_sheet(wb, wsComments, 'Comentários')
    XLSX.utils.book_append_sheet(wb, wsStats, 'Estatísticas')

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

  const categories = ['all', ...Array.from(new Set(SALAS_DATA.map((sala) => sala.categoria)))]
  const filteredSalas =
    filterCategory === 'all'
      ? SALAS_DATA
      : SALAS_DATA.filter((sala) => sala.categoria === filterCategory)

  const getSalaComments = (salaId: number) => comments.filter((c) => c.sala_id === salaId)

  const getAverageRating = (salaId: number) => {
    const salaComments = getSalaComments(salaId)
    if (salaComments.length === 0) return 0
    return salaComments.reduce((acc, c) => acc + c.rating, 0) / salaComments.length
  }

  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case 'Básico':
        return 'bg-green-100 text-green-800'
      case 'Intermediário':
        return 'bg-yellow-100 text-yellow-800'
      case 'Avançado':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (categoria: string) => {
    const colors: { [key: string]: string } = {
      Tecnologia: 'bg-blue-100 text-blue-800',
      Ciências: 'bg-purple-100 text-purple-800',
      Sustentabilidade: 'bg-green-100 text-green-800',
      História: 'bg-orange-100 text-orange-800',
      Matemática: 'bg-indigo-100 text-indigo-800',
      'Ciências Humanas': 'bg-pink-100 text-pink-800',
      Engenharia: 'bg-gray-100 text-gray-800',
      Arte: 'bg-rose-100 text-rose-800',
      Urbanismo: 'bg-teal-100 text-teal-800'
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
                    onKeyDown={(e) => e.key === 'Enter' && authenticateAdmin()}
                  />
                  <button
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
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
                  <p className="text-gray-600 text-sm">Total de Exposições</p>
                  <p className="text-3xl font-bold text-gray-900">{SALAS_DATA.length}</p>
                </div>
                <MapPin className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Exposições Visitadas</p>
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
                    {comments.length > 0
                      ? (comments.reduce((acc, c) => acc + c.rating, 0) / comments.length).toFixed(1)
                      : '0.0'}
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
                  const sala = SALAS_DATA.find((s) => s.id === comment.sala_id)
                  return (
                    <div
                      key={comment.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900">{sala?.nome}</h3>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                                sala?.categoria || ''
                              )}`}
                            >
                              {sala?.categoria}
                            </span>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < comment.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-700 mb-2">{comment.texto}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <UserIcon className="w-4 h-4" />
                              {comment.autor}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {new Date(comment.created_at).toLocaleString('pt-BR')}
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
    const sala = SALAS_DATA.find((s) => s.id === selectedSala)
    const salaComments = getSalaComments(selectedSala)
    const averageRating = getAverageRating(selectedSala)
    const isVisited = visitedRooms.some((room) => room.salaId === selectedSala)

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
                  <span className="text-sm">Exposição {sala.id}</span>
                </div>
              </div>

              <h1 className="text-3xl font-bold mb-2">{sala.nome}</h1>
              <p className="text-white/90 mb-4">{sala.professor}</p>

              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white">
                  {sala.categoria}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white">
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
              {/*IMAGEM GRANDE DA EXPOSIÇÃO*/}
              <div className="mb-6 rounded-lg overflow-hidden bg-gray-100 h-64">
                  <img
                    src={`/exposicoes/${sala.id}.jpg`}
                    alt={`Exposição ${sala.id} - ${sala.nome}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e)=>{
                      // Se não encontrar a imagem, esconde o <img> e mantém um topo cinza
                      (e.currentTarget as HTMLImageElement).style.display = 'none'
                    }}
                    />
                    </div>
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Sobre esta exposição</h2>
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
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Comentários ({salaComments.length})</h2>

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
                      <label className="block text-sm font-medium text-gray-700 mb-2">Avaliação</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button key={rating} onClick={() => setNewRating(rating)} className="p-1" aria-label={`Dar nota ${rating}`}>
                            <Star
                              className={`w-6 h-6 ${
                                rating <= newRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              } hover:text-yellow-400 transition-colors`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Escreva seu comentário sobre esta Exposição..."
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    />

                    <button
                      onClick={addComment}
                      disabled={!newComment.trim() || !newAuthor.trim() || loading}
                      className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="w-4 h-4" />
                      {loading ? 'Enviando...' : 'Enviar Comentário'}
                    </button>
                  </div>
                </div>

                {/* Lista de comentários */}
                <div className="space-y-4">
                  {salaComments.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">Seja o primeiro a comentar sobre esta exposição!</p>
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
                                  className={`w-4 h-4 ${
                                    i < comment.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(comment.created_at).toLocaleString('pt-BR')}
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

  // View: Home
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Mostra Educacional da Emef Profª Maria Célia Cabral Amaral 2025</h1>
              <p className="text-gray-600">
                Explore {SALAS_DATA.length} exposições incríveis • {visitedRooms.length} visitadas • {comments.length} comentários
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
            const isVisited = visitedRooms.some((room) => room.salaId === sala.id)
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
                {/*IMAGEM DA EXPOSIÇÃO*/}
                <div className="relative w-full h-40 overflow-hidden rounded-t-x1 bg-gray-100">
                  <img
                    src={`/exposicoes/${sala.id}.jpg`}
                    alt={`Exposição ${sala.id} - ${sala.nome}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e)=>{
                      // Se não encontrar a imagem, esconde o <img> e mantém um topo cinza
                      (e.currentTarget as HTMLImageElement).style.display = 'none'
                    }}
                    />
                    </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-2 py-1 rounded-full">
                        Exposição {sala.id}
                      </span>
                      {isVisited && <CheckCircle className="w-5 h-5 text-green-600" />}
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
                    <div className="text-indigo-600 font-medium text-sm">Explorar →</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {filteredSalas.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Nenhuma exposição encontrada nesta categoria</p>
          </div>
        )}
      </div>
    </div>
  )
}