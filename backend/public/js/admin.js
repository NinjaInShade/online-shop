function delete_product(btn) {
  const prod_id = btn.parentNode.querySelector("[name=prod_id]").value;
  const csrf = btn.parentNode.querySelector("[name=_csrf]").value;

  const product_element = btn.closest(".card");

  fetch(`http://localhost:5000/admin/delete-product/${prod_id}`, {
    method: "DELETE",
    headers: {
      "csrf-token": csrf,
    },
  })
    .then((result) => {
      return result.json();
    })
    .then((result) => {
      product_element.parentNode.removeChild(product_element);
    })
    .catch((err) => console.log(err));
}
