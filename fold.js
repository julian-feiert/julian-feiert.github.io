document.addEventListener('DOMContentLoaded', function () {
  var header = document.querySelector('.foldable-header');
  var content = document.querySelector('.foldable-content');

  header.addEventListener('click', function () {
    content.classList.toggle('active');
    header.classList.toggle('expanded');
    header.classList.toggle('folded');
  });
});