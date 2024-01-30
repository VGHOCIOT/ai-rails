class PathMarkersController < ApplicationController
  before_action :set_path_marker, only: %i[ show edit update destroy ]

  # GET /path_markers or /path_markers.json
  def index
    @path_markers = PathMarker.all
  end

  # GET /path_markers/1 or /path_markers/1.json
  def show
  end

  # GET /path_markers/new
  def new
    @path_marker = PathMarker.new
  end

  # GET /path_markers/1/edit
  def edit
  end

  # POST /path_markers or /path_markers.json
  def create
    @path_marker = PathMarker.new(path_marker_params)

    respond_to do |format|
      if @path_marker.save
        format.html { redirect_to path_marker_url(@path_marker), notice: "Path marker was successfully created." }
        format.json { render :show, status: :created, location: @path_marker }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @path_marker.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /path_markers/1 or /path_markers/1.json
  def update
    respond_to do |format|
      if @path_marker.update(path_marker_params)
        format.html { redirect_to path_marker_url(@path_marker), notice: "Path marker was successfully updated." }
        format.json { render :show, status: :ok, location: @path_marker }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @path_marker.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /path_markers/1 or /path_markers/1.json
  def destroy
    @path_marker.destroy!

    respond_to do |format|
      format.html { redirect_to path_markers_url, notice: "Path marker was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_path_marker
      @path_marker = PathMarker.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def path_marker_params
      params.fetch(:path_marker, {})
    end
end
