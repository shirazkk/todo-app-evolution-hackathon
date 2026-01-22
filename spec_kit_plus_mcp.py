# #!/usr/bin/env python3
# """
# Spec-KitPlus MCP Server
# This server exposes Spec-KitPlus commands as MCP prompts that can be used by Claude Code.
# """
# import asyncio
# from typing import Dict, Any, List
# from pathlib import Path
# import sys
# import json
# from pydantic import BaseModel, Field
# from mcp.server.fastmcp import FastMCP
# from mcp.types import Prompt, TextContent


# # Create MCP server instance for Spec-KitPlus
# mcp = FastMCP("spec_kit_plus_mcp")


# class SpecKitCommandInput(BaseModel):
#     """Input model for Spec-KitPlus command execution."""
#     command: str = Field(..., description="Name of the Spec-KitPlus command to execute (e.g., 'sp.specify', 'sp.plan', 'sp.tasks', 'sp.implement')")
#     user_input: str = Field("", description="Additional user input for the command")


# @mcp.tool(
#     name="spec_kit_plus_execute_command",
#     description="Execute a Spec-KitPlus command with user input"
# )
# async def execute_spec_kit_command(params: SpecKitCommandInput) -> str:
#     """
#     Execute a Spec-KitPlus command with the provided user input.

#     This tool allows Claude Code to run Spec-KitPlus commands like sp.specify, sp.plan,
#     sp.tasks, and sp.implement to follow the spec-driven development workflow.

#     Args:
#         params (SpecKitCommandInput): Input parameters containing:
#             - command (str): Name of the Spec-KitPlus command to execute
#             - user_input (str): Additional input for the command

#     Returns:
#         str: Result of the command execution or error message
#     """
#     try:
#         # Import the command file based on the command name
#         commands_dir = Path(".claude/commands")

#         # Look for the command file
#         command_file = commands_dir / f"{params.command}.md"

#         if not command_file.exists():
#             return f"Error: Command '{params.command}' not found. Available commands are in .claude/commands/"

#         # Read the command specification
#         command_content = command_file.read_text(encoding='utf-8')

#         # Return the command specification
#         return f"Command specification for '{params.command}':\n\n{command_content}"

#     except Exception as e:
#         return f"Error executing Spec-KitPlus command: {str(e)}"


# @mcp.tool(
#     name="spec_kit_plus_list_commands",
#     description="List all available Spec-KitPlus commands"
# )
# async def list_spec_kit_commands() -> str:
#     """
#     List all available Spec-KitPlus commands from the .claude/commands directory.

#     Returns:
#         str: JSON-formatted list of available commands
#     """
#     try:
#         commands_dir = Path(".claude/commands")

#         if not commands_dir.exists():
#             return "Error: Commands directory not found at .claude/commands"

#         # Find all .md files in the commands directory
#         command_files = list(commands_dir.glob("*.md"))
#         commands = []

#         for cmd_file in command_files:
#             command_name = cmd_file.stem  # Remove .md extension
#             commands.append(command_name)

#         # Return as JSON
#         result = {
#             "available_commands": commands,
#             "command_count": len(commands),
#             "directory": str(commands_dir.absolute())
#         }

#         return json.dumps(result, indent=2)

#     except Exception as e:
#         return f"Error listing Spec-KitPlus commands: {str(e)}"


# @mcp.tool(
#     name="spec_kit_plus_get_command_details",
#     description="Get detailed information about a specific Spec-KitPlus command"
# )
# async def get_spec_kit_command_details(command_name: str = Field(..., description="Name of the command to get details for")) -> str:
#     """
#     Get detailed information about a specific Spec-KitPlus command.

#     Args:
#         command_name (str): Name of the command to get details for

#     Returns:
#         str: Detailed information about the command or error message
#     """
#     try:
#         commands_dir = Path(".claude/commands")
#         command_file = commands_dir / f"{command_name}.md"

#         if not command_file.exists():
#             return f"Error: Command '{command_name}' not found in .claude/commands/"

#         # Read the command file content
#         content = command_file.read_text(encoding='utf-8')

#         # Return command details
#         result = {
#             "command": command_name,
#             "file_path": str(command_file.absolute()),
#             "content_preview": content[:500] + "..." if len(content) > 500 else content,
#             "size_chars": len(content)
#         }

#         return json.dumps(result, indent=2)

#     except Exception as e:
#         return f"Error getting command details: {str(e)}"


# # Function to register all available commands as prompts
# async def register_spec_kit_prompts():
#     """
#     Register all Spec-KitPlus commands as MCP prompts.
#     """
#     commands_dir = Path(".claude/commands")

#     if commands_dir.exists():
#         command_files = list(commands_dir.glob("*.md"))

#         for command_file in command_files:
#             command_name = command_file.stem

#             # Create a prompt for each command
#             command_content = command_file.read_text(encoding='utf-8')

#             # Register the command as a prompt
#             prompt = Prompt(
#                 name=f"spec_kit_{command_name}",
#                 description=f"Spec-KitPlus command: {command_name}",
#                 arguments=[
#                     {
#                         "name": "input",
#                         "description": f"User input for the {command_name} command",
#                         "required": False
#                     }
#                 ],
#                 prompts=[
#                     {
#                         "name": command_name,
#                         "description": f"Execute {command_name} command with Spec-KitPlus",
#                         "content": [
#                             TextContent(
#                                 type="text",
#                                 text=command_content
#                             )
#                         ]
#                     }
#                 ]
#             )


# if __name__ == "__main__":
#     print("Starting Spec-KitPlus MCP Server...")
#     print("This server enables Claude Code to run Spec-KitPlus commands")
#     print("Available commands will be exposed as MCP prompts")

#     # Run the MCP server
#     try:
#         mcp.run()
#     except KeyboardInterrupt:
#         print("\nShutting down Spec-KitPlus MCP Server...")
#     except Exception as e:
#         print(f"Error running MCP server: {e}")
#         sys.exit(1)