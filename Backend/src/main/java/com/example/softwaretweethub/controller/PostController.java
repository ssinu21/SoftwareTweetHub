package com.example.softwaretweethub.controller;

import com.example.softwaretweethub.model.Post;
import com.example.softwaretweethub.service.PostService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/posts")
@CrossOrigin(origins = "http://localhost:3000")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping
    public List<Post> getAllPosts() {
        return postService.getAllPosts();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPostById(@PathVariable Long id) {

        Post post = postService.getPostById(id);

        if (post == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(post);
    }

    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody Post post) {

        Post savedPost = postService.savePost(post);

        return ResponseEntity.ok(savedPost);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable Long id) {

        Post post = postService.getPostById(id);

        if (post == null) {
            return ResponseEntity.notFound().build();
        }

        postService.deletePost(id);

        return ResponseEntity.ok("Post deleted successfully");
    }
}
