class GetUrlAndObjectFoundationService
  NOT_FOUND_IMAGE_PATH = 'http://localhost:3000/assets/not_found_foundation_image-82b676ebc93ab2757bc91c2823e8d0204cdb9c1b635d4b6a51b48ebed8af3c95.jpg'
  class << self 
    def get(foundations)
      array_foundations = []
      foundations.each do |foundation|
        foundation_url = ''
        students_count = foundation.students.count
        foundation_url = foundation.image.attached? ? foundation.get_url : NOT_FOUND_IMAGE_PATH
        array_foundations.push(foundation: foundation, foundation_url: foundation_url, students_count: students_count)
      end
      array_foundations
    end
  end
end