package se.kth.sda.skeleton.post;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import se.kth.sda.skeleton.comments.*;
import se.kth.sda.skeleton.reactions.Reaction;

import java.util.List;

@Table(name = "posts")
@Entity
public class Post {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "post_generator")
    @SequenceGenerator(name = "post_generator", sequenceName = "post_seq")
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "body")
    private String body;

//    @Column(name = "claimed")
//    private boolean claimed;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "date")
    private String date;

    @Column(name = "email")
    private String email;

    @Column(name = "poster")
    private String poster;

    @NotNull(message = "Post type may not be null")
    private String postType;

    @OneToMany(cascade = CascadeType.ALL)
    private List<Reaction> reactions;

    private String category;

    @OneToMany(mappedBy = "post", cascade = CascadeType.REMOVE)
    private List<Comment> comments;

    public Post() { }

    public Post(Long id, String title, String body, String postType) {
        this.id = id;
        this.title = title;
        this.body = body;
        this.postType = postType;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

//    public boolean isClaimed() {
//        return claimed;
//    }
//
//    public void setClaimed(boolean claimed) {
//        this.claimed = claimed;
//    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPoster() {
        return poster;
    }

    public void setPoster(String poster) {
        this.poster = poster;
    }

    public String getPostType() {
        return postType;
    }

    public void setPostType(String postType) {
        this.postType = postType;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

}
