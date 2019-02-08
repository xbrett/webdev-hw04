defmodule MemoryWeb.GameChannel do
  use MemoryWeb, :channel

  alias Memory.Game
  alias Memory.Util
  alias Memory.BackupAgent, as: Save

  def join("game:" <> name, %{}, socket) do
    game = Save.read(name) || Game.new()
    socket = socket
      |> assign(:game, game)
      |> assign(:name, name)
    {:ok, %{"join" => name, "game" => Game.client_view(game)}, socket}
  end

  def handle_in("new", _payload, socket) do
    game = Game.new()
    socket = assign(socket, :game, game)
    Save.write(socket.assigns[:name], game)
    {:reply, {:ok, %{"game" => Game.client_view(game)}}, socket}
  end

  def handle_in("get_first", %{"tile" => tile}, socket) do
    game = Game.get_first(socket.assigns[:game], Util.to_atoms(tile))
    socket = assign(socket, :game, game)
    Save.write(socket.assigns[:name], game)
    {:reply, {:ok, %{"game" => Game.client_view(game)}}, socket}
  end

  def handle_in("get_second", %{"tile" => tile}, socket) do
    game = Game.get_second(socket.assigns[:game], Util.to_atoms(tile))
    socket = assign(socket, :game, game)
    Save.write(socket.assigns[:name], game)
    {:reply, {:ok, %{"game" => Game.client_view(game)}}, socket}
  end

  def handle_in("set_visible", %{"tile" => tile}, socket) do
    game = Game.set_visible(socket.assigns[:game], Util.to_atoms(tile))
    socket = assign(socket, :game, game)
    Save.write(socket.assigns[:name], game)
    {:reply, {:ok, %{"game" => Game.client_view(game)}}, socket}
  end

  def handle_in("check_match", _payload, socket) do
    game = Game.check_match(socket.assigns[:game])
    socket = assign(socket, :game, game)
    Save.write(socket.assigns[:name], game)
    {:reply, {:ok, %{"game" => Game.client_view(game)}}, socket}
  end


end
