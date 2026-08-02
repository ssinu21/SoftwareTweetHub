package com.example.softwaretweethub.repository;

import com.example.softwaretweethub.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {
}
