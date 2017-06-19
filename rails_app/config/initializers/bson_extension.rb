module BSON
  class Document
    def to_json(options = {})
      self['id'] = self['_id'].to_s
      attrs = super(options)
      attrs
    end
  end
end
