module ApplicationHelper
  def title(page_title)
    content_for :title, page_title.to_s
    page_title
  end
end
