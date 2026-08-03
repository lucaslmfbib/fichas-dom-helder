import json

with open("index.html", "r") as f:
    html = f.read()

with open("style.css", "r") as f:
    css = f.read()

with open("script.js", "r") as f:
    js = f.read()

notebook = {
    "cells": [
        {
            "cell_type": "markdown",
            "metadata": {},
            "source": [
                "# Gerador de Ficha Catalográfica - Dom Helder\n",
                "Este notebook contém o código-fonte do gerador de fichas catalográficas."
            ]
        },
        {
            "cell_type": "markdown",
            "metadata": {},
            "source": [
                "## 1. Código HTML (`index.html`)"
            ]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "%%writefile index.html\n",
                html
            ]
        },
        {
            "cell_type": "markdown",
            "metadata": {},
            "source": [
                "## 2. Código CSS (`style.css`)"
            ]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "%%writefile style.css\n",
                css
            ]
        },
        {
            "cell_type": "markdown",
            "metadata": {},
            "source": [
                "## 3. Código JavaScript (`script.js`)"
            ]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "%%writefile script.js\n",
                js
            ]
        },
        {
            "cell_type": "markdown",
            "metadata": {},
            "source": [
                "## 4. Visualizar a Aplicação dentro do Colab\n",
                "Execute a célula abaixo para rodar a interface diretamente aqui no notebook!"
            ]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "import IPython\n",
                "html_code = \"\"\"" + html.replace('<link rel="stylesheet" href="style.css?v=5">', '<style>' + css + '</style>').replace('<script src="script.js?v=5"></script>', '<script>' + js + '</script>') + "\"\"\"\n",
                "display(IPython.display.HTML(html_code))"
            ]
        }
    ],
    "metadata": {},
    "nbformat": 4,
    "nbformat_minor": 4
}

with open("gerador_ficha.ipynb", "w") as f:
    json.dump(notebook, f, indent=2)
