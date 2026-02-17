import { useState, useEffect } from 'react'
import './App.css'
import { 
  Link2, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Zap, 
  Shield, 
  Globe,
  ArrowRight,
  Loader2,
  History,
  Trash2,
  Moon,
  Sun,
  Search
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'

interface ShortenedUrl {
  id: string
  originalUrl: string
  shortUrl: string
  status: string
  createdAt: Date
}

interface LookupResult {
  originalUrl: string
}

function App() {
  const [url, setUrl] = useState('')
  const [customShortUrl, setCustomShortUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<ShortenedUrl | null>(null)
  const [copied, setCopied] = useState(false)
  const [history, setHistory] = useState<ShortenedUrl[]>([])
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [activeTab, setActiveTab] = useState<'shorten' | 'lookup' | 'history'>('shorten')
  const [lookupCode, setLookupCode] = useState('')
  const [lookupResult, setLookupResult] = useState<LookupResult | null>(null)
  const [isLookingUp, setIsLookingUp] = useState(false)

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('urlHistory')
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory)
        setHistory(parsed.map((item: ShortenedUrl) => ({
          ...item,
          createdAt: new Date(item.createdAt)
        })))
      } catch (e) {
        console.error('Failed to parse history:', e)
      }
    }
  }, [])

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('urlHistory', JSON.stringify(history))
  }, [history])

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const shortenUrl = async () => {
    if (!url.trim()) {
      toast.error('Please enter a URL')
      return
    }

    if (!validateUrl(url)) {
      toast.error('Please enter a valid URL')
      return
    }

    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch('https://sunminiurl.onrender.com/api/v1/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          original_url: url,
          custom_short_url: customShortUrl.trim(),
        }),
      })

      const data = await response.json()

      if (response.ok && data.short_url) {
        const shortUrlValue = data.short_url.startsWith('http') 
          ? data.short_url 
          : `${data.short_url}`
        
        const newUrl: ShortenedUrl = {
          id: Date.now().toString(),
          originalUrl: url,
          shortUrl: shortUrlValue,
          status: data.status,
          createdAt: new Date(),
        }

        setResult(newUrl)
        setHistory(prev => [newUrl, ...prev].slice(0, 10))
        toast.success('URL shortened successfully!')
      } else {
        toast.error(data.error || data.message || 'Failed to shorten URL')
      }
    } catch (error) {
      toast.error('Network error. Please try again.')
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success('Copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy')
    }
  }

  const deleteFromHistory = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id))
    toast.success('Removed from history')
  }

  const clearHistory = () => {
    setHistory([])
    toast.success('History cleared')
  }

  const lookupUrl = async () => {
    if (!lookupCode.trim()) {
      toast.error('Please enter a short code or URL')
      return
    }

    setIsLookingUp(true)
    setLookupResult(null)

    try {
      let code = lookupCode.trim()
      if (code.includes('/')) {
        code = code.split('/').pop() || code
      }

      const response = await fetch(`https://sunminiurl.onrender.com/api/v1/shorten/${code}`)
      const data = await response.json()

      if (data.original_url) {
        setLookupResult({
          originalUrl: data.original_url,
        })
        toast.success('URL found!')
      } else {
        toast.error(data.error || 'URL not found')
      }
    } catch (error) {
      toast.error('Network error. Please try again.')
      console.error('Error:', error)
    } finally {
      setIsLookingUp(false)
    }
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
      <Toaster position="top-center" richColors />
      
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 animate-gradient" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
      </div>

      {/* Header */}
      <header className="w-full px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Link2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              SunMiniURL
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="rounded-full"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12 animate-slide-up">
            <Badge variant="secondary" className="mb-4 px-4 py-1.5 text-sm font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Free URL Shortener
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 dark:from-white dark:via-indigo-200 dark:to-purple-200 bg-clip-text text-transparent">
              Shorten Your Links
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Transform long, complex URLs into clean, shareable links in seconds. 
              Fast, free, and incredibly simple.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
              <button
                onClick={() => setActiveTab('shorten')}
                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeTab === 'shorten'
                    ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                Shorten URL
              </button>
              <button
                onClick={() => setActiveTab('lookup')}
                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  activeTab === 'lookup'
                    ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <Search className="w-4 h-4" />
                Lookup
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  activeTab === 'history'
                    ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <History className="w-4 h-4" />
                History
                {history.length > 0 && (
                  <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 text-xs px-2 py-0.5 rounded-full">
                    {history.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {activeTab === 'shorten' ? (
            <>
              {/* URL Input Card */}
              <Card className="mb-8 border-0 shadow-2xl shadow-indigo-500/10 dark:shadow-none dark:bg-gray-800/50 backdrop-blur-sm animate-scale-in">
                <CardContent className="p-6 sm:p-8">
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <Globe className="w-5 h-5" />
                      </div>
                      <Input
                        type="url"
                        placeholder="Paste your long URL here..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && shortenUrl()}
                        className="pl-12 pr-4 py-6 text-base sm:text-lg border-2 border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-400 rounded-xl transition-all duration-300"
                      />
                    </div>
                    
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <Zap className="w-5 h-5" />
                      </div>
                      <Input
                        type="text"
                        placeholder="Custom short code (optional)"
                        value={customShortUrl}
                        onChange={(e) => setCustomShortUrl(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && shortenUrl()}
                        className="pl-12 pr-4 py-4 text-sm border-2 border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-400 rounded-xl transition-all duration-300"
                      />
                    </div>

                    <Button
                      onClick={shortenUrl}
                      disabled={isLoading}
                      className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Shortening...
                        </>
                      ) : (
                        <>
                          <Link2 className="w-5 h-5 mr-2" />
                          Shorten URL
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Result Card */}
              {result && (
                <Card className="mb-8 border-0 shadow-2xl shadow-green-500/10 dark:shadow-none dark:bg-gray-800/50 backdrop-blur-sm animate-scale-in">
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-green-600 dark:text-green-400 font-semibold">
                        Success! Your link is ready
                      </span>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 mb-4">
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Short URL</p>
                          <a
                            href={result.shortUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-lg sm:text-xl font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors truncate block"
                          >
                            {result.shortUrl}
                          </a>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => copyToClipboard(result.shortUrl)}
                            variant="outline"
                            className="rounded-xl"
                          >
                            {copied ? (
                              <Check className="w-4 h-4 mr-2 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4 mr-2" />
                            )}
                            {copied ? 'Copied!' : 'Copy'}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="truncate">Original: {result.originalUrl}</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                {[
                  {
                    icon: <Zap className="w-6 h-6" />,
                    title: 'Lightning Fast',
                    description: 'Generate short links instantly with our optimized API',
                    color: 'from-yellow-400 to-orange-500',
                  },
                  {
                    icon: <Shield className="w-6 h-6" />,
                    title: 'Secure & Reliable',
                    description: 'Your links are safe and always accessible',
                    color: 'from-green-400 to-emerald-500',
                  },
                  {
                    icon: <Sparkles className="w-6 h-6" />,
                    title: 'Custom URLs',
                    description: 'Create memorable custom short codes',
                    color: 'from-pink-400 to-rose-500',
                  },
                ].map((feature, index) => (
                  <Card
                    key={index}
                    className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 dark:bg-gray-800/50 backdrop-blur-sm"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-6 text-center">
                      <div className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white shadow-lg`}>
                        {feature.icon}
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : activeTab === 'lookup' ? (
            <>
              <Card className="mb-8 border-0 shadow-2xl shadow-indigo-500/10 dark:shadow-none dark:bg-gray-800/50 backdrop-blur-sm animate-scale-in">
                <CardContent className="p-6 sm:p-8">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Lookup Original URL
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Enter a short code or shortened URL to find the original URL
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <Search className="w-5 h-5" />
                      </div>
                      <Input
                        type="text"
                        placeholder="Enter short code or URL (e.g., LxN6kws5)"
                        value={lookupCode}
                        onChange={(e) => setLookupCode(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && lookupUrl()}
                        className="pl-12 pr-4 py-6 text-base border-2 border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-400 rounded-xl transition-all duration-300"
                      />
                    </div>

                    <Button
                      onClick={lookupUrl}
                      disabled={isLookingUp}
                      className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {isLookingUp ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Looking up...
                        </>
                      ) : (
                        <>
                          <Search className="w-5 h-5 mr-2" />
                          Lookup URL
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {lookupResult && (
                <Card className="mb-8 border-0 shadow-2xl shadow-green-500/10 dark:shadow-none dark:bg-gray-800/50 backdrop-blur-sm animate-scale-in">
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-green-600 dark:text-green-400 font-semibold">
                        Found! Original URL
                      </span>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 mb-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Original URL</p>
                      <a
                        href={lookupResult.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors truncate block"
                      >
                        {lookupResult.originalUrl}
                      </a>
                    </div>

                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex gap-2">
                        <Button
                          onClick={() => copyToClipboard(lookupResult.originalUrl)}
                          variant="outline"
                          className="rounded-xl"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </Button>
                        <Button
                          onClick={() => window.open(lookupResult.originalUrl, '_blank')}
                          variant="outline"
                          className="rounded-xl"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Open
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            /* History Tab */
            <Card className="border-0 shadow-2xl dark:bg-gray-800/50 backdrop-blur-sm animate-scale-in">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <History className="w-5 h-5 text-indigo-600" />
                    Recent Links
                  </h2>
                  {history.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearHistory}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear All
                    </Button>
                  )}
                </div>

                {history.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <History className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">
                      No shortened URLs yet. Start by shortening your first link!
                    </p>
                    <Button
                      onClick={() => setActiveTab('shorten')}
                      className="mt-4 bg-gradient-to-r from-indigo-600 to-purple-600"
                    >
                      Shorten URL
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {history.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                      >
                        <div className="flex-1 min-w-0">
                          <a
                            href={item.shortUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline truncate block"
                          >
                            {item.shortUrl}
                          </a>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {item.originalUrl}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {item.createdAt.toLocaleDateString()} at {item.createdAt.toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyToClipboard(item.shortUrl)}
                            className="rounded-lg"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteFromHistory(item.id)}
                            className="rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full px-4 sm:px-6 lg:px-8 py-8 mt-auto">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Powered by{' '}
            <a
              href="https://github.com/sun01822/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              MD. Shariar Hossain Sun
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
