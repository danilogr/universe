"@danilogasques .vimrc
"last updated 12/26/2014
"
" Requirements:
"   *  Vundle (https://github.com/gmarik/Vundle.vim) 
"
" Installing:
"   $ mkdir -R ~/.vim/bundle/Vundle.vim
"   $ git clone https://github.com/gmarik/Vundle.vim.git
"   ~/.vim/bundle/Vundle.vim
"

set nocompatible

"===============================================================================
"                                 Bundle
"===============================================================================
filetype off
set rtp+=~/.vim/bundle/Vundle.vim
call vundle#begin()

Plugin 'gmarik/Vundle.vim'                " Vundle requires itself
Plugin 'Valloric/YouCompleteMe'           " Auto-completion
Plugin 'altercation/vim-colors-solarized' " Theme
Plugin 'Townk/vim-autoclose'              " Automatically close brackets
Plugin 'airblade/vim-gitgutter'           " Shows signs for added, modified, and
                                          " removed lines (git only)
call vundle#end()
filetype plugin on
filetype plugin indent on
"===============================================================================

"general
syntax on
set showcmd                         " show incomplete commands
set list listchars=tab:→\ ,trail:.  " Thanks to github.com/3XX0 
set showmode                        " diplays current editing mode in the lower  
                                    " right corner

set sm                              " show matching braces
set number                          " show line numbers
set encoding=utf-8                  " default encoding
set ruler                           " cursor current position
set wildmenu                        " auto-completes bottom menu
set wildignore=*.o,*.swp,*.pyc,*~
set ffs=unix,dos,mac                " unix as standard file type
set mouse=a                         " enables mouse
set showmatch                       " show matching brackets when text 
                                    " indicator is over them
set colorcolumn=81                  " highlights column #80


"
"spelling
"
au FileType txt set invspell spell
nnoremap ,s :set invspell spell?<CR>

"
"search
"
set incsearch                   " search while typing (incremental)
set ignorecase                  " Ignore case when searching
set smartcase                   " but be smart about cases
set hlsearch                    " highlight search
  " key to turn off highlighted search
nnoremap ,h :silent noh<CR>

"tab and indent related
set smarttab
set expandtab                   " Tabs are converted to spaces
set ts=4                        " tabstop (number of spaces per tab character)
set sw=4                        " shiftwidth (number of spaces used to ident)
set sts=2                       " softtabstop
set cindent                     " c identation
set ai                          " Auto indent
set si                          " Smart indent
set nowrap                      " Does not wrap lines
au FileType c setl sw=8 ts=8 sts=4
au FileType cpp setl sw=4 ts=4 sts=2
au FileType py setl sw=2 ts=2 sts=1
au FileType javascript,html,css,php set ai
au FileType javascript,html,css,php set sw=2 ts=2 sts=2
au FileType javascript,css,php set textwidth=79

"Folding
set foldmethod=syntax
set foldcolumn=0
set foldenable

"fast window resizing
nmap <S-Down> :res +5<CR>
nmap <S-Up> :res -5<CR>
nmap <S-Left> <C-W>5<
nmap <S-Right> <C-W>5>

nmap <F9> :make<CR>:cw<CR>

"windows (change this for something better)
nmap <F4> <C-W>w

"Highlighting line
set cursorline
autocmd FileType javascript,html,css,php autocmd InsertLeave * set nocursorline
autocmd FileType javascript,html,css,php autocmd InsertEnter * set cursorline

"Colorscheme
set background=dark
colorscheme solarized

if has("gui_running")
    set guioptions-=T
    set guioptions+=e
else
    " Consoles are forced to used an approximate colorscheme  
    set background=light
    set t_Co=8
    let g:solarized_termcolors=256
    set t_Co=256
end

