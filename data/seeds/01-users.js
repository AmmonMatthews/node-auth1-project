
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').truncate()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {username:'Ammon', password:'asdf'},
        {username:'Arash', password:'asdf'},
        {username:'David', password:'asdf'}
      ]);
    });
};
