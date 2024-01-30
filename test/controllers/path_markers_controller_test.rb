require "test_helper"

class PathMarkersControllerTest < ActionDispatch::IntegrationTest
  setup do
    @path_marker = path_markers(:one)
  end

  test "should get index" do
    get path_markers_url
    assert_response :success
  end

  test "should get new" do
    get new_path_marker_url
    assert_response :success
  end

  test "should create path_marker" do
    assert_difference("PathMarker.count") do
      post path_markers_url, params: { path_marker: {  } }
    end

    assert_redirected_to path_marker_url(PathMarker.last)
  end

  test "should show path_marker" do
    get path_marker_url(@path_marker)
    assert_response :success
  end

  test "should get edit" do
    get edit_path_marker_url(@path_marker)
    assert_response :success
  end

  test "should update path_marker" do
    patch path_marker_url(@path_marker), params: { path_marker: {  } }
    assert_redirected_to path_marker_url(@path_marker)
  end

  test "should destroy path_marker" do
    assert_difference("PathMarker.count", -1) do
      delete path_marker_url(@path_marker)
    end

    assert_redirected_to path_markers_url
  end
end
