{
  description = "PWA Food & Symptom Tracker (React + Vite)";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs_20   # modern Node runtime
            pnpm        # or yarn/npm if you prefer
          ];

          shellHook = ''
            echo "🚀 Entered Food Symptom Tracker dev shell"
            echo "Run: pnpm install && pnpm dev"
          '';
        };
      });
}
