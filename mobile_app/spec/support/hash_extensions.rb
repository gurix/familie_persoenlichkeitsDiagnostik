class Hash
  def to_http_params
    map do |k, v|
      # TODO: Also support arrays
      if v.is_a?(Hash)
        v.map do |kk, vv|
          "#{k}[#{kk}]=#{vv}"
        end.join('&')
      else
        "#{k}=#{v}"
      end
    end.join('&')
  end
end
