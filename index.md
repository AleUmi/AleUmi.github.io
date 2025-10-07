---
layout: default
title: Home
---

<div style="text-align: center; margin-top: 2em;">
  <h1>📘 Blog di Alessio</h1>
  <p style="font-size: 1.2em; color: #555;">
    Benvenuto! Qui pubblico ogni settimana lo svolgimento dei miei <strong>homework</strong> di statistica e informatica.<br>
    Ogni articolo descrive il ragionamento, il codice e le soluzioni che ho sviluppato.
  </p>
</div>

<hr style="margin: 2em 0;">

<h2 style="text-align:center;">🗓️ Elenco Homework</h2>

<ul style="list-style-type: none; padding: 0; max-width: 700px; margin: 0 auto;">
  {% for post in site.posts %}
    <li style="margin: 1.5em 0; background-color: #f9f9f9; border-radius: 10px; padding: 1em; box-shadow: 0 0 5px rgba(0,0,0,0.1);">
      <a href="{{ post.url | relative_url }}" style="text-decoration: none; color: #2c3e50;">
        <h3 style="margin: 0;">{{ post.title }}</h3>
      </a>
      <p style="margin: 0.3em 0; color: #777;">
        📅 {{ post.date | date: "%d %B %Y" }}
      </p>
      <p style="margin: 0; color: #444;">{{ post.excerpt | strip_html | truncate: 120 }}</p>
    </li>
  {% endfor %}
</ul>

<hr style="margin: 3em 0;">

<footer style="text-align: center; color: #999; font-size: 0.9em;">
  <p>Creato con ❤️ da Alessio — powered by <a href="https://jekyllrb.com/" target="_blank">Jekyll</a> e <a href="https://pages.github.com/" target="_blank">GitHub Pages</a></p>
</footer>
