defmodule Memory.Game do
  def init_tiles do
    letters = ["A", "B", "C", "D", "E", "F", "G", "H"]
    letters ++ letters
      |> Enum.shuffle
      |> Enum.with_index
      |> Enum.map(fn {letter, index} ->
        %{letter: letter, visible: false, matched: false, key: index}
        end)
  end

  def new do
    %{
      score: 0,
      tiles: init_tiles(),
      firstClicked: nil,
      secondClicked: nil
    }
  end

  def client_view(game) do
    %{
      score: game.score,
      tiles: game.tiles,
      firstClicked: game.firstClicked,
      secondClicked: game.secondClicked
    }
  end

  def set_visible(game, tile) do
    ts = Enum.map(game.tiles, fn itm ->
      if itm.key == tile.key do
        Map.put(itm, :visible, true)
      else
        itm
      end
    end)
    Map.put(game, :tiles, ts)
  end

  def get_first(game, tile) do
    if game.firstClicked == nil do
      Map.put(game, :firstClicked, tile)
        |> Map.put(:score, game.score + 1)
    else
      game
    end
  end

  def get_second(game, tile) do
    if game.secondClicked == nil
      and game.firstClicked != nil
      and game.firstClicked.key != tile.key do
        Map.put(game, :secondClicked, tile)
          |> Map.put(:score, game.score + 1)
          |>check_match()
    else
      game
    end
  end

  def check_match(game) do
    if game.firstClicked != nil and game.secondClicked != nil do
      Process.sleep(1000)
      if (game.firstClicked.letter == game.secondClicked.letter) do
        tiles = update_tiles(game, %{visible: true, matched: true})
        Map.put(game, :tiles, tiles)
        |> Map.put(:pairsRemaining, game.pairsRemaining - 1)
      else
        tiles = update_tiles(game, %{visible: false})
        Map.put(game, :tiles, tiles)
      end
      |> Map.put(:firstClicked, nil)
      |> Map.put(:secondClicked, nil)
    end

  end

  def update_tiles(game, update) do
    Enum.map(game.tiles, fn tile ->
      if tile.key == game.firstClicked.key || tile.key == game.secondClicked.key do
        Enum.into(update, tile)
      else
        tile
      end
    end)
  end

end
