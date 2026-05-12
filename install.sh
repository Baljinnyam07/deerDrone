#!/usr/bin/env bash
set -e

# Botpress ADK CLI Installer
# Usage: curl -fsSL https://raw.githubusercontent.com/botpress/adk/main/install.sh | bash

VERSION="${ADK_VERSION:-latest}"

# Determine install directory
if [ -n "$ADK_INSTALL_DIR" ]; then
  INSTALL_DIR="$ADK_INSTALL_DIR"
elif [ -w "/usr/local/bin" ] || [ -d "/usr/local/bin" ]; then
  INSTALL_DIR="/usr/local/bin"
elif [ -d "$HOME/.local/bin" ]; then
  INSTALL_DIR="$HOME/.local/bin"
elif [ -d "$HOME/bin" ]; then
  INSTALL_DIR="$HOME/bin"
else
  INSTALL_DIR="$HOME/.local/bin"
fi

echo "🤖 Installing Botpress ADK CLI..."

# Check Node.js version
if command -v node >/dev/null 2>&1; then
  NODE_VERSION=$(node -v | sed 's/v//')
  # Simple version comparison
  NODE_MAJOR=$(echo "$NODE_VERSION" | cut -d. -f1)
  
  if [ "$NODE_MAJOR" -lt 22 ]; then
    echo "❌ Node.js version $NODE_VERSION is installed, but version 22.0.0 or higher is required"
    echo "   Please upgrade Node.js: https://nodejs.org/"
    exit 1
  else
    echo "✅ Node.js version $NODE_VERSION detected"
  fi
else
  echo "⚠️  Node.js is not installed"
  echo "   Node.js 22.0.0 or higher is required"
  echo "   Install from: https://nodejs.org/"
  echo ""
  read -p "Continue installation anyway? [y/N] " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Installation cancelled"
    exit 1
  fi
fi

# Detect OS and architecture
OS="$(uname -s)"
ARCH="$(uname -m)"

case "$OS" in
  Darwin)
    if [ "$ARCH" = "arm64" ]; then
      PLATFORM="darwin-arm64"
    else
      PLATFORM="darwin-x64"
    fi
    ;;
  Linux)
    PLATFORM="linux-x64"
    ;;
  *)
    echo "❌ Unsupported OS: $OS"
    echo "Please download the appropriate binary from:"
    echo "https://github.com/botpress/adk/releases"
    exit 1
    ;;
esac

echo "📦 Detected platform: $PLATFORM"

# Check if adk is already installed
if command -v adk >/dev/null 2>&1; then
  CURRENT_VERSION=$(adk --version 2>/dev/null | head -n1 || echo "unknown")
  echo "ℹ️  ADK is already installed (version: $CURRENT_VERSION)"
  if [ "$VERSION" = "latest" ]; then
    echo "   Upgrading to latest version..."
  else
    echo "   Reinstalling version $VERSION..."
  fi
fi

# Determine download URL
if [ "$VERSION" = "latest" ]; then
  DOWNLOAD_URL="https://github.com/botpress/adk/releases/latest/download/adk-${PLATFORM}.tar.gz"
else
  DOWNLOAD_URL="https://github.com/botpress/adk/releases/download/v${VERSION}/adk-${PLATFORM}.tar.gz"
fi

echo "⬇️  Downloading from: $DOWNLOAD_URL"

# Create temp directory
TMP_DIR=$(mktemp -d)
trap 'rm -rf "$TMP_DIR"' EXIT

# Download and extract
cd "$TMP_DIR"
if ! curl -fsSL "$DOWNLOAD_URL" | tar -xz; then
  echo "❌ Failed to download or extract ADK CLI"
  echo "Please check the release exists at:"
  echo "https://github.com/botpress/adk/releases"
  exit 1
fi

# Ensure install directory exists
if [ ! -d "$INSTALL_DIR" ]; then
  echo "📁 Creating directory: $INSTALL_DIR"
  mkdir -p "$INSTALL_DIR" || {
    echo "❌ Failed to create $INSTALL_DIR"
    echo "Try setting a custom install directory:"
    echo "  export ADK_INSTALL_DIR=\$HOME/bin"
    exit 1
  }
fi

# Install binary
echo "📥 Installing to $INSTALL_DIR..."

# Check if we can write to the install directory
if [ -w "$INSTALL_DIR" ]; then
  # Remove old binary if it exists
  [ -f "$INSTALL_DIR/adk" ] && rm "$INSTALL_DIR/adk"
  mv "adk-${PLATFORM}" "$INSTALL_DIR/adk"
  chmod +x "$INSTALL_DIR/adk"
else
  echo "🔐 Need sudo permissions to install to $INSTALL_DIR"
  # Remove old binary if it exists
  [ -f "$INSTALL_DIR/adk" ] && sudo rm "$INSTALL_DIR/adk"
  sudo mv "adk-${PLATFORM}" "$INSTALL_DIR/adk"
  sudo chmod +x "$INSTALL_DIR/adk"
fi

# Verify installation
if command -v adk >/dev/null 2>&1; then
  echo "✅ ADK CLI installed successfully!"
  echo ""
  adk --version
  echo ""
  echo "🚀 Get started:"
  echo "  adk init my-agent"
  echo "  cd my-agent"
  echo "  bun install"
  echo "  adk dev"
else
  echo "✅ Installation complete!"
  echo ""
  echo "⚠️  '$INSTALL_DIR' is not in your PATH"
  echo ""
  echo "Add it to your PATH by adding this to your shell config:"

  # Detect shell and provide appropriate instructions
  if [ -n "$BASH_VERSION" ]; then
    echo "  echo 'export PATH=\"$INSTALL_DIR:\$PATH\"' >> ~/.bashrc"
    echo "  source ~/.bashrc"
  elif [ -n "$ZSH_VERSION" ]; then
    echo "  echo 'export PATH=\"$INSTALL_DIR:\$PATH\"' >> ~/.zshrc"
    echo "  source ~/.zshrc"
  else
    echo "  export PATH=\"$INSTALL_DIR:\$PATH\""
  fi

  echo ""
  echo "Or run with full path:"
  echo "  $INSTALL_DIR/adk --version"
fi
