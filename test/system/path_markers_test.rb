require "application_system_test_case"

class PathMarkersTest < ApplicationSystemTestCase
  setup do
    @path_marker = path_markers(:one)
  end

  test "visiting the index" do
    visit path_markers_url
    assert_selector "h1", text: "Path markers"
  end

  test "should create path marker" do
    visit path_markers_url
    click_on "New path marker"

    click_on "Create Path marker"

    assert_text "Path marker was successfully created"
    click_on "Back"
  end

  test "should update Path marker" do
    visit path_marker_url(@path_marker)
    click_on "Edit this path marker", match: :first

    click_on "Update Path marker"

    assert_text "Path marker was successfully updated"
    click_on "Back"
  end

  test "should destroy Path marker" do
    visit path_marker_url(@path_marker)
    click_on "Destroy this path marker", match: :first

    assert_text "Path marker was successfully destroyed"
  end
end
