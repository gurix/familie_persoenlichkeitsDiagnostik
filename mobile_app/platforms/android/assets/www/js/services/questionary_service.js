app.service('questionaryService', function($rootScope, userService, $filter) {
  var self = this;
  
  // Determines the dimensions we have
  this.dimensions = [];
  
  // Set the ranges within values occurs
  this.minimal_value = -50;
  this.fix_minimal_value = -50;
  this.maximal_value = 50;
  this.fix_maximal_value = 50;
  
  this.value_range = function() {
    return(self.maximal_value - self.minimal_value);
  };
  
  this.fix_value_range = function() {
    return(self.maximal_value - self.minimal_value);
  };
  
  // Set the bin size
  this.category_size = 10;
  
  /**
  * Calculate category as integer for a given value depending on the range and amount of categories
  */
  this.category_for = function(value){
    return(Math.floor(value/this.category_size)*this.category_size);
  };
  
  /*
  * List of alls possible categories
  */
  this.categories = function() {
    var categories = [];
    
    for(i = self.minimal_value; i <= self.maximal_value; i = i + self.category_size) {
      categories.push(i);
    }
    
    // Sort the array
    return categories.sort(function(a,b){ return(a - b); });
  };
  
  this.fix_categories = function() {
    var categories = [];
    
    for(i = self.fix_minimal_value; i <= self.fix_maximal_value; i = i + self.category_size) {
      categories.push(i);
    }
    
    // Sort the array
    return categories.sort(function(a,b){ return(a - b); });
  };
  
  /**
  * Aggregeate data
  */
  this.aggregeate = function() {
    aggregated_data = {};
    
    // iterate through all available dimensions
    self.dimensions.forEach(function(dimension) {
      // Ensure we have an empty object for each dimension
      if (!aggregated_data[dimension]) { aggregated_data[dimension] = {}; }
      
      dimension_regex = new RegExp('^' + dimension );
      
      // First fill all categories with an empty array
      self.categories().forEach(function(category) {
        aggregated_data[dimension][category] = (aggregated_data[dimension][category] || []);
      });
      
      userService.sessions().forEach(function (session) {
        var sum = 0;
        
        // filter all items for a specific dimension
        var items = session.answers.filter(function(answer) {
          return answer.key.match(dimension_regex);
        });
        
        // Generate the sum of all items within this dimension
        items.forEach(function(item) {
          sum = sum + Number(item.recoded_value);
        });

        // Calculate the mean
        avarage = (Number(sum / items.length).toFixed(2));
        
        // Assign the session to a specific bin (category) according its mean value
        var category = self.category_for(avarage);
        if (category <= self.maximal_value && category >= self.minimal_value ){
          aggregated_data[dimension][category].push(session);
        }
      });
    });
    
    return(aggregated_data);
  };
});
