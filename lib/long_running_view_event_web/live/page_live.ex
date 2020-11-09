defmodule LongRunningViewEventWeb.PageLive do
  use LongRunningViewEventWeb, :live_view

  @impl true
  def mount(_params, _session, socket) do
    {:ok, assign(socket, query: "", results: %{}, value_29: "Unchanged", value_31: "Unchanged")}
  end

  @impl true
  def handle_event("run_for_29_seconds", _params, socket) do
    :timer.sleep(29000)
    {:noreply, assign(socket, value_29: "29 second reply success")}
  end

  @impl true
  def handle_event("run_for_31_seconds", _params, socket) do
    :timer.sleep(31000)
    {:noreply, assign(socket, value_31: "31 second reply success")}
  end

  @impl true
  def handle_event("suggest", %{"q" => query}, socket) do
    {:noreply, assign(socket, results: search(query), query: query)}
  end

  @impl true
  def handle_event("search", %{"q" => query}, socket) do
    case search(query) do
      %{^query => vsn} ->
        {:noreply, redirect(socket, external: "https://hexdocs.pm/#{query}/#{vsn}")}

      _ ->
        {:noreply,
         socket
         |> put_flash(:error, "No dependencies found matching \"#{query}\"")
         |> assign(results: %{}, query: query)}
    end
  end

  defp search(query) do
    if not LongRunningViewEventWeb.Endpoint.config(:code_reloader) do
      raise "action disabled when not in development"
    end

    for {app, desc, vsn} <- Application.started_applications(),
        app = to_string(app),
        String.starts_with?(app, query) and not List.starts_with?(desc, ~c"ERTS"),
        into: %{},
        do: {app, vsn}
  end
end
